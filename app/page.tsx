"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, Bitcoin, Wallet, ArrowUpRight, Eye } from "lucide-react"
import TransactionVisualization from "@/components/transaction-visualization"
import TransactionDetailsModal from "@/components/transaction-details-modal"

interface BitcoinAddressData {
  address: string
  balance: number
  totalReceived: number
  totalSent: number
  txCount: number
  unconfirmedBalance: number
  transactions: any[]
}

export default function BitcoinExplorer() {
  const [address, setAddress] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [addressData, setAddressData] = useState<BitcoinAddressData | null>(null)
  const [selectedTransactionHash, setSelectedTransactionHash] = useState<string | null>(null)
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false)

  const validateBitcoinAddress = (addr: string) => {
    const btcRegex = /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$|^bc1[a-z0-9]{39,59}$/
    return btcRegex.test(addr)
  }

  const formatBTC = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8)
  }

  const handleViewTransaction = (transactionHash: string) => {
    setSelectedTransactionHash(transactionHash)
    setIsTransactionModalOpen(true)
  }

  const handleSearch = async () => {
    if (!address.trim()) {
      setError("Please enter a Bitcoin address")
      return
    }

    if (!validateBitcoinAddress(address.trim())) {
      setError("Please enter a valid Bitcoin address")
      return
    }

    setError("")
    setIsLoading(true)
    setAddressData(null)

    try {
      const response = await fetch(`/api/bitcoin/${address.trim()}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch address data")
      }

      setAddressData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg">
              <Bitcoin className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Bitcoin Explorer</h1>
              <p className="text-sm text-muted-foreground">Explore Bitcoin addresses and transactions</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Bitcoin Address
              </CardTitle>
              <CardDescription>
                Enter a Bitcoin address to explore its transaction history and connections
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Input
                  placeholder="Enter Bitcoin address (e.g., 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa)"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="font-mono text-sm"
                />
                {error && <p className="text-sm text-destructive">{error}</p>}
              </div>
              <Button onClick={handleSearch} disabled={isLoading} className="w-full">
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4 mr-2" />
                    Explore Address
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {addressData && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wallet className="w-5 h-5" />
                    Address Overview
                  </CardTitle>
                  <CardDescription className="font-mono text-xs break-all">{addressData.address}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Current Balance</p>
                      <p className="text-lg font-semibold">{formatBTC(addressData.balance)} BTC</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Received</p>
                      <p className="text-lg font-semibold text-green-600">{formatBTC(addressData.totalReceived)} BTC</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Total Sent</p>
                      <p className="text-lg font-semibold text-red-600">{formatBTC(addressData.totalSent)} BTC</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">Transactions</p>
                      <p className="text-lg font-semibold">{addressData.txCount.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <TransactionVisualization address={addressData.address} />

              <Card>
                <CardHeader>
                  <CardTitle>Recent Transactions</CardTitle>
                  <CardDescription>Latest transactions for this address - click to view details</CardDescription>
                </CardHeader>
                <CardContent>
                  {addressData.transactions.length > 0 ? (
                    <div className="space-y-3">
                      {addressData.transactions.slice(0, 5).map((tx, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-muted rounded-lg hover:bg-muted/80 transition-colors cursor-pointer group"
                        >
                          <div
                            className="flex items-center gap-3 flex-1"
                            onClick={() => handleViewTransaction(tx.hash)}
                          >
                            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                              <ArrowUpRight className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-mono text-sm">{tx.hash?.substring(0, 16)}...</p>
                              <p className="text-xs text-muted-foreground">{tx.confirmations || 0} confirmations</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <p className="font-semibold">{formatBTC(tx.total || 0)} BTC</p>
                              <p className="text-xs text-muted-foreground">
                                {new Date(tx.received).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewTransaction(tx.hash)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground text-center py-4">No recent transactions found</p>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {!addressData && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Try These Example Addresses</CardTitle>
                <CardDescription>Click on any address below to explore it</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {[
                    { label: "Genesis Block Address", address: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" },
                    { label: "Popular Exchange Address", address: "1NDyJtNTjmwk5xPNhjgAMu4HDHigtobu1s" },
                    { label: "Bech32 Address", address: "bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh" },
                  ].map((example, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <div>
                        <p className="font-medium text-sm">{example.label}</p>
                        <p className="font-mono text-xs text-muted-foreground">{example.address}</p>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => setAddress(example.address)}>
                        Use
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <TransactionDetailsModal
        isOpen={isTransactionModalOpen}
        onClose={() => setIsTransactionModalOpen(false)}
        transactionHash={selectedTransactionHash}
      />
    </div>
  )
}
