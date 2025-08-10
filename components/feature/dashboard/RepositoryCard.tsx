'use client'

import { Badge } from '@/components/ui/badge'
import { Package, CheckCircle, XCircle } from 'lucide-react'
import dynamic from 'next/dynamic'
import type { Repository } from '@/types/repository'

const GitHubIcon = dynamic(
  () => import('react-icons/si').then(mod => ({ default: mod.SiGithub })),
  {
    ssr: false,
    loading: () => <div className="h-6 w-6 animate-pulse bg-muted rounded" />,
  }
)

interface RepositoryCardProps {
  repository: Repository
}

export default function RepositoryCard({ repository }: RepositoryCardProps) {
  return (
    <div className="border rounded-lg p-4 bg-card hover:bg-accent/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <GitHubIcon className="h-6 w-6 text-muted-foreground" />
          <div>
            <h3 className="font-semibold text-lg">
              {repository.owner}/{repository.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={repository.is_complete ? 'default' : 'secondary'}>
                {repository.is_complete ? (
                  <>
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Complete
                  </>
                ) : (
                  <>
                    <XCircle className="h-3 w-3 mr-1" />
                    Incomplete
                  </>
                )}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {repository.requirement_files && repository.requirement_files.length > 0 && (
        <div className="mt-4">
          <h4 className="font-medium text-sm text-muted-foreground mb-2 flex items-center gap-2">
            <Package className="h-4 w-4" />
            Requirement Files ({repository.requirement_files.length})
          </h4>
          <div className="grid gap-2">
            {repository.requirement_files.map((file, fileIndex) => (
              <div
                key={fileIndex}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-md border"
              >
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="font-mono text-sm">{file.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {file.manager}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!repository.requirement_files || repository.requirement_files.length === 0) && (
        <div className="mt-4 p-3 bg-muted/30 rounded-md border border-dashed">
          <p className="text-sm text-muted-foreground text-center">
            No requirement files found
          </p>
        </div>
      )}
    </div>
  )
}
