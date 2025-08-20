import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const address = params.address

    // Fetch detailed transaction data with inputs and outputs
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?limit=20`, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Address not found or has no transactions" }, { status: 404 })
      }
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()
    const transactions = data.txs || []

    // Process transactions to extract connections
    const connections = new Map()
    const addressNodes = new Set([address])

    transactions.forEach((tx: any) => {
      const inputs = tx.inputs || []
      const outputs = tx.outputs || []

      // Process inputs (where money came from)
      inputs.forEach((input: any) => {
        if (input.addresses && input.addresses.length > 0) {
          input.addresses.forEach((inputAddr: string) => {
            if (inputAddr !== address) {
              addressNodes.add(inputAddr)
              const key = `${inputAddr}->${address}`
              if (!connections.has(key)) {
                connections.set(key, {
                  from: inputAddr,
                  to: address,
                  value: 0,
                  transactions: [],
                })
              }
              connections.get(key).value += input.output_value || 0
              connections.get(key).transactions.push(tx.hash)
            }
          })
        }
      })

      // Process outputs (where money went to)
      outputs.forEach((output: any) => {
        if (output.addresses && output.addresses.length > 0) {
          output.addresses.forEach((outputAddr: string) => {
            if (outputAddr !== address) {
              addressNodes.add(outputAddr)
              const key = `${address}->${outputAddr}`
              if (!connections.has(key)) {
                connections.set(key, {
                  from: address,
                  to: outputAddr,
                  value: 0,
                  transactions: [],
                })
              }
              connections.get(key).value += output.value || 0
              connections.get(key).transactions.push(tx.hash)
            }
          })
        }
      })
    })

    return NextResponse.json({
      centerAddress: address,
      nodes: Array.from(addressNodes).map((addr) => ({
        id: addr,
        address: addr,
        isCenter: addr === address,
      })),
      connections: Array.from(connections.values()).slice(0, 50), // Limit connections
    })
  } catch (error) {
    console.error("Bitcoin connections API error:", error)
    return NextResponse.json({ error: "Failed to fetch Bitcoin address connections" }, { status: 500 })
  }
}
