import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { hash: string } }) {
  try {
    const hash = params.hash

    // Fetch detailed transaction data from BlockCypher
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/txs/${hash}`, {
      headers: {
        Accept: "application/json",
      },
    })

    if (!response.ok) {
      if (response.status === 404) {
        return NextResponse.json({ error: "Transaction not found" }, { status: 404 })
      }
      throw new Error(`API request failed: ${response.status}`)
    }

    const data = await response.json()

    return NextResponse.json({
      hash: data.hash,
      blockHeight: data.block_height,
      blockHash: data.block_hash,
      received: data.received,
      confirmed: data.confirmed,
      confirmations: data.confirmations,
      doubleSpend: data.double_spend,
      total: data.total,
      fees: data.fees,
      size: data.size,
      preference: data.preference,
      relayedBy: data.relayed_by,
      inputs:
        data.inputs?.map((input: any) => ({
          prevHash: input.prev_hash,
          outputIndex: input.output_index,
          outputValue: input.output_value,
          sequence: input.sequence,
          addresses: input.addresses || [],
          scriptType: input.script_type,
          age: input.age,
        })) || [],
      outputs:
        data.outputs?.map((output: any) => ({
          value: output.value,
          script: output.script,
          addresses: output.addresses || [],
          scriptType: output.script_type,
          dataHex: output.data_hex,
          dataString: output.data_string,
        })) || [],
    })
  } catch (error) {
    console.error("Bitcoin transaction API error:", error)
    return NextResponse.json({ error: "Failed to fetch transaction details" }, { status: 500 })
  }
}
