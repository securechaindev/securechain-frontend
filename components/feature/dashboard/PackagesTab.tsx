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
  userId: string
  translations: Record<string, any>
  packageOperations: any
}

export default function PackagesTab({ translations, packageOperations }: PackagesTabProps) {
  
  const {
    packageName,
    setPackageName,
    nodeType,
    setNodeType,
    depexLoading,
    handlePackageStatus
  } = packageOperations
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Package className="h-5 w-5" /> {translations.packageVersionStatusTitle}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">{translations.checkPackageStatusTitle}</h3>
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="nodeType">Package Type</Label>
              <Select value={nodeType} onValueChange={(value: any) => setNodeType(value)}>
                <SelectTrigger>
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
              <Label htmlFor="packageName">{translations.packageNameLabel}</Label>
              <Input
                id="packageName"
                value={packageName}
                onChange={e => setPackageName(e.target.value)}
                placeholder={translations.packageNamePlaceholder}
              />
            </div>
          </div>
          <Button onClick={() => {
            handlePackageStatus()
          }} disabled={depexLoading}>
            {depexLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {translations.checkPackageStatusButton}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
