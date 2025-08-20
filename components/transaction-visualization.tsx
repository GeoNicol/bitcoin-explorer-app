"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Network, ArrowRight, Wallet, RefreshCw } from "lucide-react"

interface Connection {
  from: string
  to: string
  value: number
  transactions: string[]
}

interface Node {
  id: string
  address: string
  isCenter: boolean
}

interface ConnectionData {
  centerAddress: string
  nodes: Node[]
  connections: Connection[]
}

interface TransactionVisualizationProps {
  address: string
}

export default function TransactionVisualization({ address }: TransactionVisualizationProps) {
  const [connectionData, setConnectionData] = useState<ConnectionData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const formatBTC = (satoshis: number) => {
    return (satoshis / 100000000).toFixed(8)
  }

  const truncateAddress = (addr: string) => {
    return `${addr.substring(0, 8)}...${addr.substring(addr.length - 8)}`
  }

  const fetchConnections = async () => {
    setIsLoading(true)
    setError("")

    try {
      const response = await fetch(`/api/bitcoin/${address}/connections`)
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch connections")
      }

      setConnectionData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (address) {
      fetchConnections()
    }
  }, [address])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Transaction Network
          </CardTitle>
          <CardDescription>Loading address connections...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Transaction Network
          </CardTitle>
          <CardDescription>Error loading connections</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={fetchConnections} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!connectionData || connectionData.connections.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Network className="w-5 h-5" />
            Transaction Network
          </CardTitle>
          <CardDescription>No connections found for this address</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-muted-foreground">This address has no visible transaction connections.</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Group connections by direction
  const incomingConnections = connectionData.connections.filter((conn) => conn.to === address)
  const outgoingConnections = connectionData.connections.filter((conn) => conn.from === address)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Network className="w-5 h-5" />
          Transaction Network
        </CardTitle>
        <CardDescription>Visual representation of Bitcoin flows to and from this address</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Network Visualization */}
        <div className="relative">
          {/* Center Address */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center gap-2 px-4 py-3 bg-orange-500 text-white rounded-lg font-mono text-sm">
              <Wallet className="w-4 h-4" />
              {truncateAddress(address)}
            </div>
          </div>

          {/* Incoming Connections */}
          {incomingConnections.length > 0 && (
            <div className="mb-8">
              <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                Incoming Transactions ({incomingConnections.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {incomingConnections.slice(0, 9).map((connection, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <div className="flex-1">
                        <p className="font-mono text-xs text-green-700 dark:text-green-300">
                          {truncateAddress(connection.from)}
                        </p>
                        <p className="text-xs text-green-600 dark:text-green-400 font-semibold">
                          +{formatBTC(connection.value)} BTC
                        </p>
                        <p className="text-xs text-muted-foreground">{connection.transactions.length} tx</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                ))}
              </div>
              {incomingConnections.length > 9 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  +{incomingConnections.length - 9} more incoming connections
                </p>
              )}
            </div>
          )}

          {/* Outgoing Connections */}
          {outgoingConnections.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-4 text-center">
                Outgoing Transactions ({outgoingConnections.length})
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {outgoingConnections.slice(0, 9).map((connection, index) => (
                  <div key={index} className="relative">
                    <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-800">
                      <ArrowRight className="w-4 h-4 text-red-600" />
                      <div className="flex-1">
                        <p className="font-mono text-xs text-red-700 dark:text-red-300">
                          {truncateAddress(connection.to)}
                        </p>
                        <p className="text-xs text-red-600 dark:text-red-400 font-semibold">
                          -{formatBTC(connection.value)} BTC
                        </p>
                        <p className="text-xs text-muted-foreground">{connection.transactions.length} tx</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {outgoingConnections.length > 9 && (
                <p className="text-center text-sm text-muted-foreground mt-2">
                  +{outgoingConnections.length - 9} more outgoing connections
                </p>
              )}
            </div>
          )}
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">{incomingConnections.length}</p>
            <p className="text-sm text-muted-foreground">Incoming Connections</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">{outgoingConnections.length}</p>
            <p className="text-sm text-muted-foreground">Outgoing Connections</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
