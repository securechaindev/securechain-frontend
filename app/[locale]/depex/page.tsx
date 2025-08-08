'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/hooks/use-toast'
import { Package, GitPullRequest, CheckCircle, XCircle, Loader2, Badge } from 'lucide-react'
import { SiGithub } from 'react-icons/si'
import { AuthProvider } from '@/components/auth-provider'
import { useAuth } from '@/hooks/use-auth'

function DepexPageContent() {
  const [userId] = useState('user-123') // Mock user ID
  const [repoOwner, setRepoOwner] = useState('')
  const [repoName, setRepoName] = useState('')
  const [packageName, setPackageName] = useState('')
  const [packageVersion, setPackageVersion] = useState('')
  const [repoInitResult, setRepoInitResult] = useState<any>(null)
  const [packageStatusResult, setPackageStatusResult] = useState<any>(null)
  const [versionStatusResult, setVersionStatusResult] = useState<any>(null)
  const [packageInitResult, setPackageInitResult] = useState<any>(null)
  const [versionInitResult, setVersionInitResult] = useState<any>(null)
  const [userRepositories, setUserRepositories] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()
  const { makeAuthenticatedRequest } = useAuth()

  const handleRepoInit = async () => {
    setLoading(true)
    setRepoInitResult(null)
    try {
      const response = await makeAuthenticatedRequest('/api/depex/repository/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, owner: repoOwner, repo: repoName }),
      })
      const data = await response.json()
      setRepoInitResult(data)
      if (response.ok) {
        toast({
          title: 'Repository Initialized',
          description: data.message,
        })
        // Refresh user repositories after initialization
        fetchUserRepositories()
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to initialize repository',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePackageStatus = async () => {
    setLoading(true)
    setPackageStatusResult(null)
    try {
      const response = await makeAuthenticatedRequest(
        `/api/depex/package/status?userId=${userId}&packageName=${packageName}`
      )
      const data = await response.json()
      setPackageStatusResult(data)
      if (response.ok) {
        toast({
          title: 'Package Status',
          description: data.message,
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to get package status',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVersionStatus = async () => {
    setLoading(true)
    setVersionStatusResult(null)
    try {
      const response = await makeAuthenticatedRequest(
        `/api/depex/version/status?userId=${userId}&packageName=${packageName}&version=${packageVersion}`
      )
      const data = await response.json()
      setVersionStatusResult(data)
      if (response.ok) {
        toast({
          title: 'Version Status',
          description: data.message,
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to get version status',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePackageInit = async () => {
    setLoading(true)
    setPackageInitResult(null)
    try {
      const response = await makeAuthenticatedRequest('/api/depex/package/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, packageName }),
      })
      const data = await response.json()
      setPackageInitResult(data)
      if (response.ok) {
        toast({
          title: 'Package Initialized',
          description: data.message,
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to initialize package',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleVersionInit = async () => {
    setLoading(true)
    setVersionInitResult(null)
    try {
      const response = await makeAuthenticatedRequest('/api/depex/version/init', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, packageName, version: packageVersion }),
      })
      const data = await response.json()
      setVersionInitResult(data)
      if (response.ok) {
        toast({
          title: 'Version Initialized',
          description: data.message,
        })
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to initialize version',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchUserRepositories = async () => {
    setLoading(true)
    try {
      const response = await makeAuthenticatedRequest(`/api/depex/repositories/${userId}`)
      const data = await response.json()
      if (response.ok) {
        setUserRepositories(data.repositories)
      } else {
        toast({
          title: 'Error',
          description: data.error || 'Failed to fetch user repositories',
          variant: 'destructive',
        })
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred while fetching repositories',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch repositories on component mount
  useState(() => {
    fetchUserRepositories()
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-blue-950 p-8">
      <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 md:p-8">
        <h1 className="text-4xl font-extrabold text-center text-gray-900 dark:text-white mb-8">
          Depex: Dependency Explorer
        </h1>

        <Tabs defaultValue="repositories" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="repositories">
              <SiGithub className="h-4 w-4 mr-2" /> Repositories
            </TabsTrigger>
            <TabsTrigger value="packages">
              <Package className="h-4 w-4 mr-2" /> Packages
            </TabsTrigger>
            <TabsTrigger value="initialization">
              <GitPullRequest className="h-4 w-4 mr-2" /> Initialization
            </TabsTrigger>
          </TabsList>

          {/* Repositories Tab */}
          <TabsContent value="repositories" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SiGithub className="h-5 w-5" /> Your Repositories
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">
                  View and manage repositories analyzed by Depex for user:{' '}
                  <span className="font-semibold">{userId}</span>
                </p>
                <Button onClick={fetchUserRepositories} disabled={loading} className="mb-4">
                  {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                  Refresh Repositories
                </Button>
                {userRepositories.length === 0 && !loading && (
                  <p className="text-muted-foreground">
                    No repositories found for this user. Try initializing one!
                  </p>
                )}
                {userRepositories.length > 0 && (
                  <ul className="space-y-2">
                    {userRepositories.map((repo, index) => (
                      <li
                        key={index}
                        className="flex items-center justify-between p-3 border rounded-md bg-gray-50 dark:bg-gray-700"
                      >
                        <span className="font-medium">
                          {repo.owner}/{repo.repo}
                        </span>
                        <Badge>{repo.status}</Badge>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Packages Tab */}
          <TabsContent value="packages" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" /> Package & Version Status
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Check Package Status</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="packageName">Package Name</Label>
                    <Input
                      id="packageName"
                      value={packageName}
                      onChange={e => setPackageName(e.target.value)}
                      placeholder="e.g., react"
                    />
                  </div>
                  <Button onClick={handlePackageStatus} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Check Package Status
                  </Button>
                  {packageStatusResult && (
                    <div
                      className={`p-3 rounded-md flex items-center gap-2 ${packageStatusResult.exists ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                    >
                      {packageStatusResult.exists ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span>{packageStatusResult.message}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold">Check Version Status</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="packageVersion">Package Version</Label>
                    <Input
                      id="packageVersion"
                      value={packageVersion}
                      onChange={e => setPackageVersion(e.target.value)}
                      placeholder="e.g., 18.2.0"
                    />
                  </div>
                  <Button onClick={handleVersionStatus} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Check Version Status
                  </Button>
                  {versionStatusResult && (
                    <div
                      className={`p-3 rounded-md flex items-center gap-2 ${versionStatusResult.exists ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                    >
                      {versionStatusResult.exists ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span>{versionStatusResult.message}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Initialization Tab */}
          <TabsContent value="initialization" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GitPullRequest className="h-5 w-5" /> Initialize Data
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">Initialize Repository</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="repoOwner">Repository Owner</Label>
                      <Input
                        id="repoOwner"
                        value={repoOwner}
                        onChange={e => setRepoOwner(e.target.value)}
                        placeholder="e.g., vercel"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="repoName">Repository Name</Label>
                      <Input
                        id="repoName"
                        value={repoName}
                        onChange={e => setRepoName(e.target.value)}
                        placeholder="e.g., next.js"
                      />
                    </div>
                  </div>
                  <Button onClick={handleRepoInit} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Initialize Repository
                  </Button>
                  {repoInitResult && (
                    <div
                      className={`p-3 rounded-md flex items-center gap-2 ${repoInitResult.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                    >
                      {repoInitResult.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span>{repoInitResult.message}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold">Initialize Package</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="initPackageName">Package Name</Label>
                    <Input
                      id="initPackageName"
                      value={packageName}
                      onChange={e => setPackageName(e.target.value)}
                      placeholder="e.g., lodash"
                    />
                  </div>
                  <Button onClick={handlePackageInit} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Initialize Package
                  </Button>
                  {packageInitResult && (
                    <div
                      className={`p-3 rounded-md flex items-center gap-2 ${packageInitResult.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                    >
                      {packageInitResult.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span>{packageInitResult.message}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-4 border-t pt-6 mt-6">
                  <h3 className="text-lg font-semibold">Initialize Version</h3>
                  <div className="grid gap-2">
                    <Label htmlFor="initPackageVersion">Package Version</Label>
                    <Input
                      id="initPackageVersion"
                      value={packageVersion}
                      onChange={e => setPackageVersion(e.target.value)}
                      placeholder="e.g., 4.17.21"
                    />
                  </div>
                  <Button onClick={handleVersionInit} disabled={loading}>
                    {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    Initialize Version
                  </Button>
                  {versionInitResult && (
                    <div
                      className={`p-3 rounded-md flex items-center gap-2 ${versionInitResult.success ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}
                    >
                      {versionInitResult.success ? (
                        <CheckCircle className="h-5 w-5" />
                      ) : (
                        <XCircle className="h-5 w-5" />
                      )}
                      <span>{versionInitResult.message}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default function DepexPage() {
  return (
    <AuthProvider>
      <DepexPageContent />
    </AuthProvider>
  )
}
