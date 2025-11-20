'use client'

import React, { useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { Button, Badge } from '@/components/ui'
import { usePackageGraph } from '@/hooks/api/usePackageGraph'
import type { GraphNode, GraphEdge, PackageGraphViewProps } from '@/types/PackageGraph'

export default function PackageGraphView({ open, onOpenChange, packageName, purl, nodeType  }: PackageGraphViewProps) {
  const { graph, expandNode, collapseNode, fetched, loadingNodes } = usePackageGraph({ packageName, purl, nodeType })
  const [selected, setSelected] = useState<GraphNode | null>(null)
  const [selectedEdge, setSelectedEdge] = useState<GraphEdge | null>(null)
  const [showLimitWarning, setShowLimitWarning] = useState(false)
  const [showLegend, setShowLegend] = useState(true)
  const [showStats, setShowStats] = useState(true)
  const [showOnlyLatest, setShowOnlyLatest] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const graphRef = useRef<any>(null)
  const graphDataRef = useRef(graph)
  const expandNodeRef = useRef(expandNode)
  const collapseNodeRef = useRef(collapseNode)
  const [isClient, setIsClient] = useState(false)

  const MAX_NODES = 200

  useEffect(() => {
    graphDataRef.current = graph
  }, [graph])

  useEffect(() => {
    expandNodeRef.current = expandNode
  }, [expandNode])

  useEffect(() => {
    collapseNodeRef.current = collapseNode
  }, [collapseNode])

  // Handler for the "show only latest" checkbox
  const handleShowOnlyLatestChange = useCallback((checked: boolean) => {
    setShowOnlyLatest(checked)
    
    if (checked) {
      // Clear selected node and edge
      setSelected(null)
      setSelectedEdge(null)
      
      // Group version nodes by their parent package
      const versionsByPackage = new Map<string, GraphNode[]>()
      
      graph.edges.forEach(edge => {
        if (edge.type === 'HAVE') {
          const versionNode = graph.nodes.find(n => n.id === edge.target)
          if (versionNode && versionNode.type === 'Version') {
            if (!versionsByPackage.has(edge.source)) {
              versionsByPackage.set(edge.source, [])
            }
            versionsByPackage.get(edge.source)!.push(versionNode)
          }
        }
      })

      // Find latest version for each package and collapse non-latest expanded versions
      versionsByPackage.forEach((versions, packageId) => {
        if (versions.length > 1) {
          const latest = versions.reduce((prev, current) => {
            const prevSerial = prev.props?.serial_number || 0
            const currentSerial = current.props?.serial_number || 0
            return currentSerial > prevSerial ? current : prev
          })

          // Check if any non-latest version has outgoing dependencies (is expanded)
          versions.forEach(version => {
            if (version.id !== latest.id) {
              const outgoingEdges = graph.edges.filter(edge => edge.source === version.id)
              const hasOutgoingDeps = outgoingEdges.length > 0
              if (hasOutgoingDeps) {
                collapseNode(version.id)
              }
            }
          })
        }
      })
    }
  }, [graph.edges, graph.nodes, collapseNode])

  // When "show only latest" is enabled, collapse all non-latest versions
  useEffect(() => {
    if (!showOnlyLatest) return

    // Use a timeout to avoid race conditions with graph updates
    const timer = setTimeout(() => {
      // Group version nodes by their parent package
      const versionsByPackage = new Map<string, GraphNode[]>()
      
      graph.edges.forEach(edge => {
        if (edge.type === 'HAVE') {
          const versionNode = graph.nodes.find(n => n.id === edge.target)
          if (versionNode && versionNode.type === 'Version') {
            if (!versionsByPackage.has(edge.source)) {
              versionsByPackage.set(edge.source, [])
            }
            versionsByPackage.get(edge.source)!.push(versionNode)
          }
        }
      })

      // Find latest version for each package and collapse non-latest expanded versions
      versionsByPackage.forEach((versions, packageId) => {
        if (versions.length > 1) {
          const latest = versions.reduce((prev, current) => {
            const prevSerial = prev.props?.serial_number || 0
            const currentSerial = current.props?.serial_number || 0
            return currentSerial > prevSerial ? current : prev
          })

          // Check if any non-latest version has outgoing dependencies (is expanded)
          versions.forEach(version => {
            if (version.id !== latest.id) {
              // Check if this version has any DEPENDS_ON edges (is expanded)
              const hasOutgoingDeps = graph.edges.some(
                edge => edge.type === 'DEPENDS_ON' && edge.source === version.id
              )
              if (hasOutgoingDeps) {
                collapseNodeRef.current(version.id)
              }
            }
          })
        }
      })
    }, 100)

    return () => clearTimeout(timer)
  }, [showOnlyLatest])

  // Export graph as image
  const exportGraphAsImage = useCallback(() => {
    if (!graphRef.current) return
    
    try {
      // Get the canvas element from force-graph
      const canvas = containerRef.current?.querySelector('canvas')
      if (!canvas) {
        console.error('Canvas not found')
        return
      }
      
      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return
        
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.download = `${packageName}-graph-${new Date().toISOString().split('T')[0]}.png`
        link.href = url
        link.click()
        URL.revokeObjectURL(url)
      })
    } catch (error) {
      console.error('Error exporting graph:', error)
    }
  }, [packageName])

  // Only render on client side
  useEffect(() => {
    setIsClient(true)
  }, [])

  // Get color based on package type
  const getPackageColor = (type: string) => {
    if (type === 'PyPIPackage') return '#3776ab'      // Python blue
    if (type === 'NPMPackage') return '#cb3837'       // npm red
    if (type === 'NuGetPackage') return '#512bd4'     // NuGet purple
    if (type === 'CargoPackage') return '#f74c00'     // Rust orange
    if (type === 'RubyGemsPackage') return '#701516'  // Ruby dark red/burgundy
    if (type === 'MavenPackage') return '#f89820'     // Maven orange/yellow
    if (type.includes('Package')) return '#1e3a8a'    // Default deep blue
    return '#3b82f6'                                   // Version: lighter blue
  }

  // Get package ecosystem label
  const getPackageEcosystem = (type: string) => {
    if (type === 'PyPIPackage') return 'PyPI'
    if (type === 'NPMPackage') return 'npm'
    if (type === 'NuGetPackage') return 'NuGet'
    if (type === 'CargoPackage') return 'Cargo'
    if (type === 'RubyGemsPackage') return 'RubyGems'
    if (type === 'MavenPackage') return 'Maven'
    return null
  }

  // Convert graph data to force-graph format
  const graphData = useMemo(() => {
    let filteredNodes = graph.nodes
    let filteredEdges = graph.edges

    // Filter to show only latest version of each package if enabled
    if (showOnlyLatest) {
      // Group version nodes by their parent package
      const versionsByPackage = new Map<string, GraphNode[]>()
      
      graph.edges.forEach(edge => {
        if (edge.type === 'HAVE') {
          const versionNode = graph.nodes.find(n => n.id === edge.target)
          if (versionNode && versionNode.type === 'Version') {
            if (!versionsByPackage.has(edge.source)) {
              versionsByPackage.set(edge.source, [])
            }
            versionsByPackage.get(edge.source)!.push(versionNode)
          }
        }
      })

      // Find latest version (highest serial_number) for each package
      const latestVersionIds = new Set<string>()
      versionsByPackage.forEach((versions, packageId) => {
        if (versions.length > 0) {
          const latest = versions.reduce((prev, current) => {
            const prevSerial = prev.props?.serial_number || 0
            const currentSerial = current.props?.serial_number || 0
            return currentSerial > prevSerial ? current : prev
          })
          latestVersionIds.add(latest.id)
        }
      })

      // Filter nodes: keep all packages, but only latest versions
      filteredNodes = graph.nodes.filter(node => {
        if (node.type === 'Version') {
          return latestVersionIds.has(node.id)
        }
        return true // Keep all package nodes
      })

      // Filter edges: only keep edges connected to remaining nodes
      const nodeIds = new Set(filteredNodes.map(n => n.id))
      filteredEdges = graph.edges.filter(edge => 
        nodeIds.has(edge.source) && nodeIds.has(edge.target)
      )
    }

    return {
      nodes: filteredNodes.map(node => {
        const hasVulnerabilities = node.props?.vulnerabilities && node.props.vulnerabilities.length > 0
        const ecosystem = getPackageEcosystem(node.type)
        
        return {
          id: node.id,
          label: node.label,
          type: node.type,
          props: node.props,
          val: node.type.includes('Package') ? 15 : 8,
          color: getPackageColor(node.type),
          hasVulnerabilities,
          ecosystem
        }
      }),
      links: filteredEdges.map(edge => {
        return {
          source: edge.source,
          target: edge.target,
          type: edge.type,
          props: edge.props,
          id: edge.id
        }
      })
    }
  }, [graph, selectedEdge, showOnlyLatest])

  // Calculate graph statistics (use filtered data from graphData)
  const graphStats = useMemo(() => {
    const displayedNodes = graphData.nodes
    const displayedEdges = graphData.links
    
    const nodesWithVulnerabilities = displayedNodes.filter(node => 
      node.props?.vulnerabilities && node.props.vulnerabilities.length > 0
    ).length
    
    const totalVulnerabilities = displayedNodes.reduce((sum, node) => 
      sum + (node.props?.vulnerabilities?.length || 0), 0
    )
    
    // Calculate maximum depth from root nodes (nodes with no incoming edges)
    const calculateMaxDepth = () => {
      const incomingEdges = new Map<string, number>()
      displayedNodes.forEach(n => incomingEdges.set(n.id, 0))
      displayedEdges.forEach(e => {
        incomingEdges.set(e.target, (incomingEdges.get(e.target) || 0) + 1)
      })
      
      const rootNodes = displayedNodes.filter(n => incomingEdges.get(n.id) === 0)
      if (rootNodes.length === 0) return 0
      
      const visited = new Set<string>()
      const depths = new Map<string, number>()
      
      const dfs = (nodeId: string, depth: number): number => {
        if (visited.has(nodeId)) return depths.get(nodeId) || 0
        visited.add(nodeId)
        depths.set(nodeId, depth)
        
        let maxChildDepth = depth
        displayedEdges.forEach(edge => {
          if (edge.source === nodeId) {
            maxChildDepth = Math.max(maxChildDepth, dfs(edge.target, depth + 1))
          }
        })
        
        return maxChildDepth
      }
      
      let maxDepth = 0
      rootNodes.forEach(root => {
        maxDepth = Math.max(maxDepth, dfs(root.id, 0))
      })
      
      return maxDepth
    }
    
    return {
      totalNodes: displayedNodes.length,
      totalEdges: displayedEdges.length,
      nodesWithVulnerabilities,
      totalVulnerabilities,
      maxDepth: calculateMaxDepth(),
      packageNodes: displayedNodes.filter(n => n.type.includes('Package')).length,
      versionNodes: displayedNodes.filter(n => n.type === 'Version').length
    }
  }, [graphData])

  // Check if node limit is reached (use visible nodes from graphData)
  const isNodeLimitReached = graphData.nodes.length >= MAX_NODES

  // Initialize force-graph
  useEffect(() => {
    if (!isClient || !open || !containerRef.current || graphRef.current) return

    const container = containerRef.current
    const width = container.clientWidth
    const height = container.clientHeight

    // Dynamic import only on client side
    import('force-graph').then((module) => {
      const ForceGraph = module.default

      if (!graphRef.current && containerRef.current) {
        try {
          // Create graph instance - ForceGraph is a constructor
          // @ts-ignore - TypeScript doesn't recognize the correct API
          const Graph = new ForceGraph()
          graphRef.current = Graph

          // Attach to DOM container
          // @ts-ignore
          Graph(containerRef.current)

          Graph
            .width(width)
            .height(height)
            .backgroundColor('#00000000')
            .nodeLabel((node: any) => {
              const vulnerabilities = node.props?.vulnerabilities || []
              const vulnText = vulnerabilities.length > 0 
                ? `\n⚠️ ${vulnerabilities.length} vulnerabilities` 
                : ''
              const ecosystem = node.ecosystem ? ` [${node.ecosystem}]` : ''
              const typeInfo = node.type.includes('Package') ? 'Package' : 'Version'
              return `${node.label} (${typeInfo})${ecosystem}${vulnText}`
            })
            .nodeRelSize(6)
            .nodeVal((node: any) => node.val)
            .nodeColor((node: any) => node.color)
            .nodeCanvasObject((node: any, ctx: any, globalScale: number) => {
              const label = node.label
              const fontSize = 12 / globalScale
              const nodeRadius = Math.sqrt(node.val) * 4

              // Draw node circle with lightened opaque fill
              ctx.beginPath()
              ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI)
              
              // Create a lighter version of the node color (opaque)
              // Extract RGB from hex color
              const hex = node.color.replace('#', '')
              const r = parseInt(hex.substr(0, 2), 16)
              const g = parseInt(hex.substr(2, 2), 16)
              const b = parseInt(hex.substr(4, 2), 16)
              
              // Mix with white to create lighter opaque color (85% white, 15% original)
              const lightR = Math.round(r * 0.15 + 255 * 0.85)
              const lightG = Math.round(g * 0.15 + 255 * 0.85)
              const lightB = Math.round(b * 0.15 + 255 * 0.85)
              
              ctx.fillStyle = `rgb(${lightR}, ${lightG}, ${lightB})`
              ctx.fill()
              
              // Draw solid border
              ctx.strokeStyle = node.color
              ctx.lineWidth = 3
              ctx.stroke()

              // Draw vulnerability indicator badge (just red circle, no icon)
              if (node.hasVulnerabilities) {
                const badgeRadius = 5 / globalScale
                const badgeX = node.x + nodeRadius - badgeRadius
                const badgeY = node.y - nodeRadius + badgeRadius
                
                // Red circle
                ctx.beginPath()
                ctx.arc(badgeX, badgeY, badgeRadius, 0, 2 * Math.PI)
                ctx.fillStyle = '#dc2626'
                ctx.fill()
                ctx.strokeStyle = '#ffffff'
                ctx.lineWidth = 1.5
                ctx.stroke()
              }

              // Draw ecosystem badge for Package nodes
              if (node.ecosystem) {
                const badgeHeight = 10 / globalScale
                const badgePadding = 3 / globalScale
                const badgeFontSize = 7 / globalScale
                
                ctx.font = `bold ${badgeFontSize}px Sans-Serif`
                const badgeText = node.ecosystem
                const textWidth = ctx.measureText(badgeText).width
                const badgeWidth = textWidth + badgePadding * 2
                
                const badgeX = node.x - badgeWidth / 2
                const badgeY = node.y - nodeRadius - badgeHeight - 3 / globalScale
                
                // Draw badge background
                ctx.fillStyle = node.color
                ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight)
                
                // Draw badge text
                ctx.fillStyle = '#ffffff'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(badgeText, node.x, badgeY + badgeHeight / 2)
              }

              // Draw label below node
              ctx.font = `${fontSize}px Sans-Serif`
              ctx.textAlign = 'center'
              ctx.textBaseline = 'top'
              ctx.fillStyle = node.color
              const textY = node.y + nodeRadius + 4
              ctx.fillText(label, node.x, textY)

              // Store node radius for link calculations and click detection
              node.__radius = nodeRadius
            })
            .nodePointerAreaPaint((node: any, color: string, ctx: any) => {
              // Use exact same radius calculation
              const nodeRadius = node.__radius || Math.sqrt(node.val) * 4
              ctx.fillStyle = color
              ctx.beginPath()
              ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI)
              ctx.fill()
            })
            .linkColor((link: any) => link.color || '#64748b')
            .linkWidth((link: any) => 2)
            .linkDirectionalArrowLength(0)
            .linkDirectionalArrowRelPos(1)
            .linkDirectionalParticles(0)
            .linkCanvasObjectMode(() => 'replace')
            .linkCanvasObject((link: any, ctx: any) => {
              const start = link.source
              const end = link.target
              
              // Get node radius
              const sourceRadius = start.__radius || Math.sqrt(start.val || 8) * 4
              const targetRadius = end.__radius || Math.sqrt(end.val || 8) * 4
              
              // Calculate direction vector
              const dx = end.x - start.x
              const dy = end.y - start.y
              const dist = Math.sqrt(dx * dx + dy * dy)
              
              if (dist === 0) return
              
              // Normalize direction
              const nx = dx / dist
              const ny = dy / dist
              
              // Calculate line start and end positions (from edge to edge of nodes)
              const lineStartX = start.x + nx * sourceRadius
              const lineStartY = start.y + ny * sourceRadius
              const lineEndX = end.x - nx * targetRadius
              const lineEndY = end.y - ny * targetRadius
              
              // Draw the link line
              ctx.beginPath()
              ctx.moveTo(lineStartX, lineStartY)
              ctx.lineTo(lineEndX, lineEndY)
              ctx.strokeStyle = link.color || '#64748b'
              ctx.lineWidth = 2
              ctx.stroke()
              
              // Position arrow tip exactly at the edge of target node
              const arrowLength = 10
              const arrowWidth = 6
              const tipX = lineEndX
              const tipY = lineEndY
              
              // Draw single arrowhead with tip at node edge
              ctx.save()
              ctx.translate(tipX, tipY)
              ctx.rotate(Math.atan2(dy, dx))
              
              ctx.beginPath()
              ctx.moveTo(0, 0) // Tip of arrow at node edge
              ctx.lineTo(-arrowLength, -arrowWidth / 2)
              ctx.lineTo(-arrowLength, arrowWidth / 2)
              ctx.closePath()
              
              ctx.fillStyle = link.color || '#64748b'
              ctx.fill()
              ctx.restore()
              
              // Draw relationship type label in the middle of the link
              if (link.type) {
                const midX = (start.x + end.x) / 2
                const midY = (start.y + end.y) / 2
                
                const fontSize = 6
                ctx.font = `${fontSize}px Sans-Serif`
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                
                // Draw text with semi-transparent background
                const textWidth = ctx.measureText(link.type).width
                const padding = 3
                
                // Draw semi-transparent background
                ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
                ctx.fillRect(
                  midX - textWidth / 2 - padding,
                  midY - fontSize / 2 - padding,
                  textWidth + padding * 2,
                  fontSize + padding * 2
                )
                
                // Draw text
                ctx.fillStyle = link.color || '#64748b'
                ctx.fillText(link.type, midX, midY)
              }
            })
            .onNodeClick((node: any) => {
              const graphNode = graphDataRef.current.nodes.find((n: GraphNode) => n.id === node.id)
              if (!graphNode) return

              setSelected(graphNode)
              setSelectedEdge(null)
            })
            .onLinkClick((link: any) => {
              const edge = graphDataRef.current.edges.find((e: GraphEdge) => e.id === link.id)
              if (edge) {
                setSelectedEdge(edge)
                setSelected(null)
              }
            })

          // Set graph data after configuration
          Graph.graphData(graphData)
          
          // Force engine to warm up with smooth animations
          const chargeForce = Graph.d3Force('charge')
          if (chargeForce) chargeForce.strength(-300)
          const linkForce = Graph.d3Force('link')
          if (linkForce) linkForce.distance(100)
          
          // Enable smooth camera transitions
          Graph.cooldownTime(1000)
          Graph.cooldownTicks(100)
          Graph.d3AlphaDecay(0.02)
          Graph.d3VelocityDecay(0.3)

          // Zoom to fit after physics stabilizes
          setTimeout(() => {
            Graph.zoomToFit(400, 50)
          }, 2000)
        } catch (error) {
          console.error('Error creating graph instance:', error)
        }
      }
    }).catch(error => {
      console.error('Error loading force-graph:', error)
    })

    return () => {
      if (graphRef.current) {
        try {
          graphRef.current._destructor?.()
        } catch (e) {
          console.error('Error destroying graph:', e)
        }
        graphRef.current = null
      }
    }
  }, [isClient, open])

  // Update graph data when it changes
  useEffect(() => {
    if (graphRef.current && graphData) {
      // Only update if the number of nodes/edges actually changed
      const currentData = graphRef.current.graphData()
      if (currentData.nodes?.length !== graphData.nodes.length || 
          currentData.links?.length !== graphData.links.length) {
        graphRef.current.graphData(graphData)
      }
    }
  }, [graphData])

  // Handle ESC key to close
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onOpenChange(false)
      }
    }

    if (open) {
      window.addEventListener('keydown', handleEscape)
      return () => window.removeEventListener('keydown', handleEscape)
    }
  }, [open, onOpenChange])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 bg-background">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="p-4 border-b flex items-center justify-between bg-background">
          <div className="flex items-center gap-3">
            <h3 className="text-lg font-bold">Package Graph</h3>
            <Badge>{packageName}</Badge>
            <Badge variant={isNodeLimitReached ? 'destructive' : 'secondary'}>
              {graphData.nodes.length}/{MAX_NODES} nodes
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={showOnlyLatest}
                onChange={(e) => handleShowOnlyLatestChange(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="select-none">Show only latest versions</span>
            </label>
            <Button variant="outline" size="sm" onClick={exportGraphAsImage}>
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export PNG
            </Button>
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              <span className="mr-2">Close</span>
              <span className="text-xs opacity-60">[Esc]</span>
            </Button>
          </div>
        </div>

        {/* Node limit warning */}
        {isNodeLimitReached && (
          <div className="mx-4 mt-4 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
            <p className="text-sm text-destructive">
              <strong>Node limit reached:</strong> You have reached the maximum of {MAX_NODES} nodes. 
              Collapse some nodes to expand others.
            </p>
          </div>
        )}

        {/* Graph and properties */}
        <div className="flex-1 flex gap-4 p-4 min-h-0">
          {/* Force Graph */}
          <div className="flex-1 relative bg-muted/20 rounded-md overflow-hidden">
            {isClient ? (
              <>
                <div ref={containerRef} className="w-full h-full" />
                
                {/* Legend */}
                {showLegend && (
                  <div className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm border rounded-lg p-4 text-xs space-y-3 shadow-lg max-w-[280px]">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-sm">Legend</h5>
                      <button 
                        onClick={() => setShowLegend(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="font-medium text-xs text-muted-foreground">Package Ecosystems</div>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full border-2 border-[#3776ab] bg-[#e6f2ff]"></div>
                          <span className="text-xs">PyPI</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full border-2 border-[#cb3837] bg-[#ffe6e6]"></div>
                          <span className="text-xs">npm</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full border-2 border-[#512bd4] bg-[#f0ebff]"></div>
                          <span className="text-xs">NuGet</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full border-2 border-[#f74c00] bg-[#fff4eb]"></div>
                          <span className="text-xs">Cargo</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full border-2 border-[#701516] bg-[#fde8e8]"></div>
                          <span className="text-xs">RubyGems</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full border-2 border-[#f89820] bg-[#fff8eb]"></div>
                          <span className="text-xs">Maven</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t">
                      <div className="font-medium text-xs text-muted-foreground">Node Types</div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-[#3776ab] bg-[#e6f2ff]"></div>
                        <span>Package</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded-full border-2 border-[#3b82f6] bg-[#dbeafe]"></div>
                        <span>Version</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="relative w-4 h-4 rounded-full border-2 border-[#3b82f6] bg-[#dbeafe]">
                          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-600 border border-white"></div>
                        </div>
                        <span>Has vulnerabilities</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t">
                      <div className="font-medium text-xs text-muted-foreground">Relationships</div>
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-0.5 bg-[#64748b]"></div>
                        <span>HAVE / REQUIRE</span>
                      </div>
                    </div>
                    
                    <div className="pt-2 border-t text-muted-foreground">
                      <div>💡 Hover for quick info</div>
                    </div>
                  </div>
                )}
                
                {/* Toggle Legend Button */}
                {!showLegend && (
                  <button
                    onClick={() => setShowLegend(true)}
                    className="absolute bottom-4 left-4 bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 text-xs font-medium hover:bg-accent transition-colors shadow-lg"
                  >
                    Show Legend
                  </button>
                )}
                
                {/* Statistics Panel */}
                {showStats && (
                  <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm border rounded-lg p-4 text-xs space-y-3 shadow-lg min-w-[200px]">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-semibold text-sm">Statistics</h5>
                      <button 
                        onClick={() => setShowStats(false)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        ✕
                      </button>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Nodes:</span>
                        <span className="font-semibold">{graphStats.totalNodes}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Edges:</span>
                        <span className="font-semibold">{graphStats.totalEdges}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Packages:</span>
                        <span className="font-semibold">{graphStats.packageNodes}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Versions:</span>
                        <span className="font-semibold">{graphStats.versionNodes}</span>
                      </div>
                    </div>
                    
                    <div className="space-y-2 pt-2 border-t">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Max Depth:</span>
                        <span className="font-semibold">{graphStats.maxDepth}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Nodes w/ Vulns:</span>
                        <span className="font-semibold text-red-600">{graphStats.nodesWithVulnerabilities}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Total Vulns:</span>
                        <span className="font-semibold text-red-600">{graphStats.totalVulnerabilities}</span>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Toggle Stats Button */}
                {!showStats && (
                  <button
                    onClick={() => setShowStats(true)}
                    className="absolute top-4 right-4 bg-background/95 backdrop-blur-sm border rounded-lg px-3 py-2 text-xs font-medium hover:bg-accent transition-colors shadow-lg"
                  >
                    Show Statistics
                  </button>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                Loading graph...
              </div>
            )}
          </div>

          {/* Properties Panel */}
          <div className="w-80 border-l p-4 overflow-auto bg-background">
            <h4 className="font-semibold mb-3">
              {selectedEdge
                ? ('Relationship properties')
                : ('Node properties')}
            </h4>

            {selectedEdge ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs uppercase">{selectedEdge.type || 'UNKNOWN'}</Badge>
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => navigator.clipboard?.writeText(selectedEdge.id)}
                    title="Copy ID"
                  >
                    Copy
                  </button>
                </div>

                <div className="space-y-2 text-sm border-b pb-3">
                  {graph.nodes.find(n => n.id === selectedEdge.source) && (
                    <div>
                      <div className="text-xs text-muted-foreground">from</div>
                      <div className="text-sm font-medium">
                        {graph.nodes.find(n => n.id === selectedEdge.source)?.label}
                      </div>
                    </div>
                  )}
                  {graph.nodes.find(n => n.id === selectedEdge.target) && (
                    <div>
                      <div className="text-xs text-muted-foreground">to</div>
                      <div className="text-sm font-medium">
                        {graph.nodes.find(n => n.id === selectedEdge.target)?.label}
                      </div>
                    </div>
                  )}
                </div>

                {selectedEdge.props && Object.keys(selectedEdge.props).length > 0 && (
                  <div className="space-y-2 text-sm">
                    {Object.entries(selectedEdge.props)
                      .filter(([key]) => key !== 'elementid' && key !== 'id')
                      .map(([key, value]) => (
                        <div key={key}>
                          <div className="text-xs text-muted-foreground">{key}</div>
                          <div className="text-sm break-words">
                            {typeof value === 'object'
                              ? <div className="bg-muted p-1 rounded font-mono text-xs">{JSON.stringify(value)}</div>
                              : String(value)}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : selected ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">{selected.type}</Badge>
                  <button
                    className="text-xs text-muted-foreground hover:text-foreground"
                    onClick={() => navigator.clipboard?.writeText(selected.id)}
                    title="Copy ID"
                  >
                    Copy
                  </button>
                </div>

                <div className="space-y-2 text-sm">
                  <div>
                    <div className="text-xs text-muted-foreground">purl</div>
                    <div className="text-xs break-words bg-muted p-1 rounded font-mono">
                      {selected.props?.purl || 'N/A'}
                    </div>
                  </div>

                  {selected.type === 'Version' && (
                    <>
                      <div>
                        <div className="text-xs text-muted-foreground">name</div>
                        <div className="text-sm font-medium">{selected.props?.name}</div>
                      </div>
                      {selected.props?.release_date && (
                        <div>
                          <div className="text-xs text-muted-foreground">release_date</div>
                          <div className="text-xs">{selected.props.release_date}</div>
                        </div>
                      )}
                      {selected.props?.vulnerabilities && selected.props.vulnerabilities.length > 0 && (
                        <div>
                          <div className="text-xs text-muted-foreground">vulnerabilities</div>
                          <div className="flex flex-wrap gap-1">
                            {selected.props.vulnerabilities.map((vuln: string) => (
                              <a
                                key={vuln}
                                href={`https://osv.dev/vulnerability/${vuln}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 px-2 py-1 rounded transition-colors"
                              >
                                {vuln}
                              </a>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {selected.type.includes('Package') && (
                    <>
                      <div>
                        <div className="text-xs text-muted-foreground">name</div>
                        <div className="text-sm font-medium">{selected.props?.name}</div>
                      </div>
                      {selected.props?.vendor && (
                        <div>
                          <div className="text-xs text-muted-foreground">vendor</div>
                          <div className="text-sm">{selected.props.vendor}</div>
                        </div>
                      )}
                      {selected.props?.repository_url && (
                        <div>
                          <div className="text-xs text-muted-foreground">repository_url</div>
                          <div className="text-xs break-all">{selected.props.repository_url}</div>
                        </div>
                      )}
                      {selected.props?.import_names && (
                        <div>
                          <div className="text-xs text-muted-foreground">import_names</div>
                          <div className="text-xs bg-muted p-1 rounded">
                            {JSON.stringify(selected.props.import_names)}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <div className="flex flex-col gap-2 pt-2 border-t">
                  {isNodeLimitReached && !fetched[selected.id] && (
                    <div className="text-xs text-destructive bg-destructive/10 p-2 rounded">
                      Node limit reached. Collapse other nodes first.
                    </div>
                  )}
                  <Button
                    size="sm"
                    onClick={() => {
                      if (isNodeLimitReached && !fetched[selected.id]) {
                        setShowLimitWarning(true)
                        setTimeout(() => setShowLimitWarning(false), 3000)
                        return
                      }
                      expandNodeRef.current(selected.id)
                    }}
                    disabled={!!fetched[selected.id] || loadingNodes[selected.id] || (isNodeLimitReached && !fetched[selected.id])}
                    className="w-full"
                  >
                    {loadingNodes[selected.id] ? 'Loading...' : fetched[selected.id] ? 'Expanded' : 'Expand'}
                  </Button>
                  {fetched[selected.id] && (
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => collapseNodeRef.current(selected.id)}
                      className="w-full"
                    >
                      Collapse
                    </Button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-sm text-muted-foreground">
                Select a node or edge to see properties
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
