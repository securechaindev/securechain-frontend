import {
  Button,
  Input,
  Label,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui'
import { Package, Loader2 } from 'lucide-react'

interface PackagesTabProps {
  packageOperations: any
}

export default function PackagesTab({ packageOperations }: PackagesTabProps) {
  const { packageName, setPackageName, nodeType, setNodeType, depexLoading, handlePackageStatus } =
    packageOperations
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Package className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="truncate">Package & Version Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 sm:space-y-6">
        <div className="space-y-4">
          <h3 className="text-base sm:text-lg font-semibold">Check Package Status</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nodeType" className="text-sm font-medium">
                Package Type
              </Label>
              <Select value={nodeType} onValueChange={(value: any) => setNodeType(value)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select package type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PyPIPackage">PyPI</SelectItem>
                  <SelectItem value="NPMPackage">NPM</SelectItem>
                  <SelectItem value="MavenPackage">Maven</SelectItem>
                  <SelectItem value="RubyGemsPackage">RubyGems</SelectItem>
                  <SelectItem value="CargoPackage">Cargo</SelectItem>
                  <SelectItem value="NuGetPackage">NuGet</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="packageName" className="text-sm font-medium">
                Package Name
              </Label>
              <Input
                id="packageName"
                value={packageName}
                onChange={e => setPackageName(e.target.value)}
                placeholder="e.g., numpy, express, etc."
                className="w-full"
              />
            </div>
          </div>
          <Button
            onClick={() => {
              handlePackageStatus()
            }}
            disabled={depexLoading}
            className="w-full sm:w-auto"
            size="sm"
          >
            {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            <span className="text-xs sm:text-sm">Check Status</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
