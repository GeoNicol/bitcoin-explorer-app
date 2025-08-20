"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Copy, ArrowDown, ArrowUp, Clock, Hash, Blocks } from "lucide-react"

interface TransactionInput {
  prevHash: string
  outputIndex: number
  outputValue: number
  addresses: string[]
  scriptType: string
  age: number
}

interface TransactionOutput {
  value: number
  addresses: string[]
  scriptType: string
  dataHex?: string
  dataString?: string
}

interface TransactionDetails {
  hash: string
  blockHeight: number
  blockHash: string
  received: string
  confirmed: string
  confirmations: number
  doubleSpend: boolean
  total: number
  fees: number
  size: number
  preference: string
  relayedBy: string
  inputs: TransactionInput[]
  outputs: TransactionOutput[]
}

interface TransactionDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  transactionHash: string | null
}

export default function TransactionDetailsModal({ isOpen, onClose, transactionHash }: TransactionDetailsModalProps) {
  const [transactionDetails, setTransactionDetails] = useState<TransactionDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const formatBTC = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8)
  }

  const truncateHash = (hash: string, length = 16) => {
    return `${hash.substring(0, length)}...${hash.substring(hash.length - length)}`
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const fetchTransactionDetails = async (hash: string) => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/bitcoin/tx/${hash}`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch transaction details")
      }

      setTransactionDetails(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && transactionHash) {
      fetchTransactionDetails(transactionHash)
    }
  }, [isOpen, transactionHash])

  const handleClose = () => {
    setTransactionDetails(null)
    setError("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Hash className="w-5 h-5" />
            Transaction Details
          </DialogTitle>
          <DialogDescription>Comprehensive information about this Bitcoin transaction</DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => transactionHash && fetchTransactionDetails(transactionHash)} variant="outline">
              Try Again
            </Button>
          </div>
        )}

        {transactionDetails && (
          <div className="space-y-6">
            {/* Transaction Overview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Transaction Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Hash</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs">{truncateHash(transactionDetails.hash)}</span>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(transactionDetails.hash)}>
                          <Copy className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Block Height</span>
                      <Badge variant="secondary">
                        <Blocks className="w-3 h-3 mr-1" />
                        {transactionDetails.blockHeight?.toLocaleString() || "Unconfirmed"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Confirmations</span>
                      <Badge variant={transactionDetails.confirmations >= 6 ? "default" : "secondary"}>
                        {transactionDetails.confirmations}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Total Amount</span>
                      <span className="font-semibold">{formatBTC(transactionDetails.total)} BTC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Fees</span>
                      <span className="font-semibold text-orange-600">{formatBTC(transactionDetails.fees)} BTC</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Size</span>
                      <span className="text-sm">{transactionDetails.size} bytes</span>
                    </div>
                  </div>
                </div>

                {transactionDetails.received && (
                  <div className="flex items-center gap-2 pt-2 border-t">
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Received: {new Date(transactionDetails.received).toLocaleString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Transaction Flow */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Inputs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ArrowDown className="w-5 h-5 text-red-500" />
                    Inputs ({transactionDetails.inputs.length})
                  </CardTitle>
                  <CardDescription>Sources of Bitcoin for this transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactionDetails.inputs.map((input, index) => (
                      <div
                        key={index}
                        className="p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">From</span>
                            <span className="font-semibold text-red-600">{formatBTC(input.outputValue)} BTC</span>
                          </div>
                          {input.addresses.map((address, addrIndex) => (
                            <div key={addrIndex} className="flex items-center gap-2">
                              <span className="font-mono text-xs text-red-700 dark:text-red-300 break-all">
                                {address}
                              </span>
                              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(address)}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          <div className="text-xs text-muted-foreground">
                            Script: {input.scriptType} • Age: {input.age} blocks
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Outputs */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <ArrowUp className="w-5 h-5 text-green-500" />
                    Outputs ({transactionDetails.outputs.length})
                  </CardTitle>
                  <CardDescription>Destinations of Bitcoin from this transaction</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {transactionDetails.outputs.map((output, index) => (
                      <div
                        key={index}
                        className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800"
                      >
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">To</span>
                            <span className="font-semibold text-green-600">{formatBTC(output.value)} BTC</span>
                          </div>
                          {output.addresses.map((address, addrIndex) => (
                            <div key={addrIndex} className="flex items-center gap-2">
                              <span className="font-mono text-xs text-green-700 dark:text-green-300 break-all">
                                {address}
                              </span>
                              <Button size="sm" variant="ghost" onClick={() => copyToClipboard(address)}>
                                <Copy className="w-3 h-3" />
                              </Button>
                            </div>
                          ))}
                          <div className="text-xs text-muted-foreground">Script: {output.scriptType}</div>
                          {output.dataString && (
                            <div className="text-xs text-muted-foreground">Data: {output.dataString}</div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
