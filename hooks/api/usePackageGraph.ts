'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { depexAPI } from '@/lib/api/apiClient'
import type { GraphNode, GraphEdge, GraphResponse } from '@/types/PackageGraph'

interface UsePackageGraphProps {
  packageName: string
  purl: string
  nodeType: string
}

export function usePackageGraph({ packageName, purl, nodeType }: UsePackageGraphProps) {
  const [graph, setGraph] = useState<GraphResponse>(() => {
    const props: any = {
      name: packageName,
    }

    if (nodeType !== 'RequirementFile') {
      props.purl = purl
    }

    return {
      nodes: [
        {
          id: purl,
          label: packageName,
          type: nodeType,
          props: props,
        },
      ],
      edges: [],
    }
  })

  const [fetched, setFetched] = useState<Record<string, boolean>>({})
  const [loadingNodes, setLoadingNodes] = useState<Record<string, boolean>>({})
  const [expansions, setExpansions] = useState<Record<string, string[]>>({})

  const prevPropsRef = useRef({ packageName, purl, nodeType })

  useEffect(() => {
    const prevProps = prevPropsRef.current
    if (
      prevProps.packageName !== packageName ||
      prevProps.purl !== purl ||
      prevProps.nodeType !== nodeType
    ) {
      const props: any = {
        name: packageName,
      }

      if (nodeType !== 'RequirementFile') {
        props.purl = purl
      }

      setGraph({
        nodes: [
          {
            id: purl,
            label: packageName,
            type: nodeType,
            props: props,
          },
        ],
        edges: [],
      })
      setFetched({})
      setExpansions({})
      setLoadingNodes({})

      prevPropsRef.current = { packageName, purl, nodeType }
    }
  }, [packageName, purl, nodeType])

  const expandNode = useCallback(
    async (nodeId: string) => {
      if (fetched[nodeId] || loadingNodes[nodeId]) return

      setLoadingNodes((s: Record<string, boolean>) => ({ ...s, [nodeId]: true }))

      try {
        const node = graph.nodes.find(n => n.id === nodeId)
        if (!node) {
          throw new Error('Node not found')
        }

        let response
        if (node.type === 'Version') {
          response = await depexAPI.graph.expandVersion({
            version_purl: node.props?.purl || nodeId,
          })
        } else if (node.type === 'RequirementFile') {
          response = await depexAPI.graph.expandReqFile({
            requirement_file_id: nodeId,
          })
        } else {
          const requireEdge = graph.edges.find(e => e.type === 'REQUIRE' && e.target === nodeId)
          const constraints = requireEdge?.props?.constraints || null

          const requestData = {
            node_type: node.type,
            package_purl: node.props?.purl || nodeId,
            constraints: constraints,
          }

          response = await depexAPI.graph.expandPackage(requestData)
        }

        if (!response.ok || !response.data) {
          throw new Error('Failed to expand node')
        }

        const expandData = response.data.data as GraphResponse

        setGraph((current: GraphResponse) => {
          const nodesById: Record<string, GraphNode> = {}
          current.nodes.forEach((n: GraphNode) => (nodesById[n.id] = n))

          const currentIds = new Set(current.nodes.map(n => n.id))
          const addedNodeIds: string[] = []

          expandData.nodes.forEach((n: GraphNode) => {
            if (n.id == null) {
              console.warn('Skipping node with null id:', n)
              return
            }

            if (!currentIds.has(n.id)) addedNodeIds.push(n.id)
            nodesById[n.id] = { ...nodesById[n.id], ...n }
          })

          const edgesById: Record<string, GraphEdge> = {}
          current.edges.forEach((e: GraphEdge) => (edgesById[e.id] = e))

          expandData.edges.forEach((e: GraphEdge) => {
            if (e.id == null || e.source == null || e.target == null) {
              console.warn('Skipping edge with null values:', e)
              return
            }
            edgesById[e.id] = e
          })

          if (addedNodeIds.length > 0) {
            setExpansions(prev => ({
              ...prev,
              [nodeId]: [...(prev[nodeId] || []), ...addedNodeIds],
            }))
          }

          return { nodes: Object.values(nodesById), edges: Object.values(edgesById) }
        })

        setFetched((s: Record<string, boolean>) => ({ ...s, [nodeId]: true }))
      } catch (error) {
        console.error('Error expanding node:', error)
      } finally {
        setLoadingNodes((s: Record<string, boolean>) => ({ ...s, [nodeId]: false }))
      }
    },
    [fetched, graph]
  )

  const collapseNode = useCallback(
    (nodeId: string) => {
      const toRemove: string[] = []
      const seen = new Set<string>()

      const stack = [...(expansions[nodeId] || [])]
      while (stack.length) {
        const cur = stack.pop() as string
        if (seen.has(cur)) continue
        seen.add(cur)
        toRemove.push(cur)
        const children = expansions[cur] || []
        children.forEach(c => stack.push(c))
      }

      setGraph(current => {
        if (toRemove.length === 0) {
          const edges = current.edges.filter(e => e.source !== nodeId)
          return { nodes: current.nodes, edges }
        } else {
          const removeSet = new Set(toRemove)
          const nodes = current.nodes.filter(n => !removeSet.has(n.id))
          const edges = current.edges.filter(e => {
            return !(removeSet.has(e.source) || removeSet.has(e.target) || e.source === nodeId)
          })
          return { nodes, edges }
        }
      })

      setExpansions(prev => {
        const next = { ...prev }
        toRemove.forEach(id => delete next[id])
        delete next[nodeId]
        return next
      })

      setFetched(s => {
        const next = { ...s }
        toRemove.forEach(id => delete next[id])
        next[nodeId] = false
        return next
      })
    },
    [expansions]
  )

  const reload = useCallback(() => {
    const props: any = {
      name: packageName,
    }

    if (nodeType !== 'RequirementFile') {
      props.purl = purl
    }

    setGraph({
      nodes: [
        {
          id: purl,
          label: packageName,
          type: nodeType,
          props: props,
        },
      ],
      edges: [],
    })
    setFetched({})
    setExpansions({})
    setLoadingNodes({})
  }, [packageName, purl, nodeType])

  return useMemo(
    () => ({ graph, expandNode, collapseNode, reload, fetched, loadingNodes }),
    [graph, expandNode, collapseNode, reload, fetched, loadingNodes]
  )
}
