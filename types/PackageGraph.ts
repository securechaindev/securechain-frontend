export interface GraphNodeProps {
  [key: string]: any
}

export interface GraphNode {
  id: string
  label: string
  type: string
  props?: GraphNodeProps
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  type?: string
  props?: Record<string, any>
}

export interface GraphResponse {
  nodes: GraphNode[]
  edges: GraphEdge[]
  totalNeighbors?: number
  truncated?: boolean
}

export interface PackageGraphViewProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  packageName: string
  translations: Record<string, any>
  purl: string
  nodeType: string
}
