import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: { address: string } }) {
  try {
    const address = params.address

    // Using BlockCypher API (free tier, no API key required)
    const response = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}?limit=50`, {
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

    // Also fetch recent transactions for the address
    const txResponse = await fetch(`https://api.blockcypher.com/v1/btc/main/addrs/${address}/full?limit=10`, {
      headers: {
        Accept: "application/json",
      },
    })

    let transactions = []
    if (txResponse.ok) {
      const txData = await txResponse.json()
      transactions = txData.txs || []
    }

    return NextResponse.json({
      address: data.address,
      balance: data.balance || 0,
      totalReceived: data.total_received || 0,
      totalSent: data.total_sent || 0,
      txCount: data.n_tx || 0,
      unconfirmedBalance: data.unconfirmed_balance || 0,
      transactions: transactions.slice(0, 10), // Limit to 10 most recent
    })
  } catch (error) {
    console.error("Bitcoin API error:", error)
    return NextResponse.json({ error: "Failed to fetch Bitcoin address data" }, { status: 500 })
  }
}
