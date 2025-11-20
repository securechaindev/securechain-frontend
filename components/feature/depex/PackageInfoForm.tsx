'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Search } from 'lucide-react'
import { useState } from 'react'

interface PackageInfoFormProps {
  onSubmit: (_packageName: string, _maxDepth: number, _nodeType: string) => void
  isLoading: boolean
}

const NODE_TYPES = [
  { value: 'PyPIPackage', label: 'PyPI (Python)' },
  { value: 'NPMPackage', label: 'NPM (Node.js)' },
  { value: 'MavenPackage', label: 'Maven (Java)' },
  { value: 'CargoPackage', label: 'Cargo (Rust)' },
  { value: 'RubyGemsPackage', label: 'RubyGems (Ruby)' },
  { value: 'NuGetPackage', label: 'NuGet (.NET)' },
] as const

export function PackageInfoForm({ onSubmit, isLoading }: PackageInfoFormProps) {
  const [packageName, setPackageName] = useState('')
  const [maxDepth, setMaxDepth] = useState('3')
  const [nodeType, setNodeType] = useState<string>('PyPIPackage')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!packageName.trim()) return

    const depth = parseInt(maxDepth, 10)
    if (isNaN(depth) || depth < 1) return

    onSubmit(packageName.trim(), depth, nodeType)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {/* Package Name Input */}
        <div className="space-y-2">
          <Label htmlFor="package-name">
            Package Name
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="package-name"
            type="text"
            placeholder="e.g., lodash"
            value={packageName}
            onChange={e => setPackageName(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {/* Max Depth Input */}
        <div className="space-y-2">
          <Label htmlFor="max-depth">
            Max Depth
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Input
            id="max-depth"
            type="number"
            min="1"
            max="10"
            placeholder="3"
            value={maxDepth}
            onChange={e => setMaxDepth(e.target.value)}
            disabled={isLoading}
            required
          />
        </div>

        {/* Node Type Select */}
        <div className="space-y-2">
          <Label htmlFor="node-type">
            Node Type
            <span className="text-destructive ml-1">*</span>
          </Label>
          <Select value={nodeType} onValueChange={setNodeType} disabled={isLoading}>
            <SelectTrigger id="node-type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {NODE_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" disabled={isLoading || !packageName.trim()}>
          <Search className="mr-2 h-4 w-4" />
          {isLoading ? 'Analyzing...' : 'Analyze Package'}
        </Button>
      </div>
    </form>
  )
}
