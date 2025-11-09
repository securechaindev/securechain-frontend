'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Badge } from '@/components/ui/Badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/Table'
import { useToast } from '@/hooks/ui/useToast'
import { API_ENDPOINTS } from '@/constants/apiEndpoints'
import { apiClient } from '@/lib/api/apiClient'
import { Copy, Key, ShieldOff } from 'lucide-react'

interface ApiKey {
  id: string
  name: string
  key_hash: string
  created_at: string
  expires_at: string
  is_active: boolean
}

interface ApiKeysDialogProps {
  open: boolean
  onOpenChange: (_open: boolean) => void
  translations: Record<string, any>
}

export function ApiKeysDialog({ open, onOpenChange, translations }: ApiKeysDialogProps) {
  const { toast } = useToast()
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newKeyName, setNewKeyName] = useState('')
  const [durationDays, setDurationDays] = useState<10 | 20 | 30>(10)
  const [newlyCreatedKey, setNewlyCreatedKey] = useState<string | null>(null)

  const t = useCallback(
    (key: string) => {
      const keys = key.split('.')
      let value: any = translations
      for (const k of keys) {
        value = value?.[k]
      }
      return value || key
    },
    [translations]
  )

  const fetchApiKeys = useCallback(async () => {
    try {
      setLoading(true)
      const response = await apiClient.get(API_ENDPOINTS.API_KEYS.LIST)

      if (response.data.code === 'success' || response.data.code === 'api_key_list_success') {
        const keys = Array.isArray(response.data.data)
          ? response.data.data
          : response.data.data?.api_keys || []
        setApiKeys(keys)
      } else {
        toast({
          variant: 'destructive',
          title: translations.errorTitle || 'Error',
          description: t(`api.${response.data.code}`) || translations.networkErrorDescription,
        })
      }
    } catch {
      toast({
        variant: 'destructive',
        title: translations.errorTitle || 'Error',
        description: translations.networkErrorDescription || 'An error occurred',
      })
    } finally {
      setLoading(false)
    }
  }, [toast, translations, t])

  useEffect(() => {
    if (open) {
      fetchApiKeys()
    } else {
      setNewlyCreatedKey(null)
    }
  }, [open, fetchApiKeys])

  const createApiKey = async () => {
    if (!newKeyName.trim()) {
      toast({
        variant: 'destructive',
        title: translations.errorTitle || 'Error',
        description: t('apiKeys.error.nameRequired'),
      })
      return
    }

    if (![10, 20, 30].includes(durationDays)) {
      toast({
        variant: 'destructive',
        title: translations.errorTitle || 'Error',
        description: t('apiKeys.error.invalidDuration'),
      })
      return
    }

    try {
      setCreating(true)
      const response = await apiClient.post(API_ENDPOINTS.API_KEYS.CREATE, {
        name: newKeyName.trim(),
        duration_days: durationDays,
      })

      if (response.data.code === 'success' || response.data.code === 'api_key_created') {
        setNewlyCreatedKey(response.data.data?.api_key || null)
        setNewKeyName('')
        await fetchApiKeys()
        toast({
          title: translations.loginSuccessTitle || 'Success',
          description: t('api.api_key_created') || t('apiKeys.success.created'),
        })
      } else {
        toast({
          variant: 'destructive',
          title: translations.errorTitle || 'Error',
          description: t(`api.${response.data.code}`) || translations.networkErrorDescription,
        })
      }
    } catch {
      toast({
        variant: 'destructive',
        title: translations.errorTitle || 'Error',
        description: translations.networkErrorDescription || 'An error occurred',
      })
    } finally {
      setCreating(false)
    }
  }

  const revokeApiKey = async (keyId: string) => {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.API_KEYS.REVOKE(keyId))

      if (response.data.code === 'success' || response.data.code === 'api_key_revoked') {
        await fetchApiKeys()
        toast({
          title: translations.loginSuccessTitle || 'Success',
          description: t('api.api_key_revoked') || t('apiKeys.success.revoked'),
        })
      } else {
        toast({
          variant: 'destructive',
          title: translations.errorTitle || 'Error',
          description: t(`api.${response.data.code}`) || translations.networkErrorDescription,
        })
      }
    } catch {
      toast({
        variant: 'destructive',
        title: translations.errorTitle || 'Error',
        description: translations.networkErrorDescription || 'An error occurred',
      })
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast({
      title: translations.loginSuccessTitle || 'Success',
      description: t('apiKeys.success.copied'),
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            {t('apiKeys.title')}
          </DialogTitle>
          <DialogDescription>{t('apiKeys.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 border-b pb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="keyName">{t('apiKeys.form.name')}</Label>
              <Input
                id="keyName"
                value={newKeyName}
                onChange={e => setNewKeyName(e.target.value)}
                placeholder={t('apiKeys.form.namePlaceholder')}
                disabled={creating}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">{t('apiKeys.form.duration')}</Label>
              <Select
                value={durationDays.toString()}
                onValueChange={value => setDurationDays(parseInt(value) as 10 | 20 | 30)}
                disabled={creating}
              >
                <SelectTrigger id="duration">
                  <SelectValue placeholder={t('apiKeys.form.selectDuration')} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">{t('apiKeys.form.days10')}</SelectItem>
                  <SelectItem value="20">{t('apiKeys.form.days20')}</SelectItem>
                  <SelectItem value="30">{t('apiKeys.form.days30')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button
            onClick={createApiKey}
            disabled={creating || !newKeyName.trim()}
            className="w-full"
          >
            {creating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            ) : (
              t('apiKeys.actions.create')
            )}
          </Button>

          {newlyCreatedKey && (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                {t('apiKeys.warning.copyNow')}
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-2 bg-white dark:bg-gray-900 rounded text-sm font-mono overflow-x-auto">
                  {newlyCreatedKey}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(newlyCreatedKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">{t('apiKeys.list.title')}</h3>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : apiKeys.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">{t('apiKeys.list.empty')}</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('apiKeys.list.name')}</TableHead>
                  <TableHead>{t('apiKeys.list.created')}</TableHead>
                  <TableHead>{t('apiKeys.list.expires')}</TableHead>
                  <TableHead>{t('apiKeys.list.status')}</TableHead>
                  <TableHead className="text-right">{t('apiKeys.list.actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {apiKeys.map(apiKey => (
                  <TableRow key={apiKey.id}>
                    <TableCell className="font-medium">{apiKey.name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {apiKey.created_at ? new Date(apiKey.created_at).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {apiKey.expires_at
                        ? new Date(apiKey.expires_at).toLocaleDateString()
                        : t('apiKeys.list.noExpiration')}
                    </TableCell>
                    <TableCell>
                      <Badge variant={apiKey.is_active ? 'default' : 'secondary'}>
                        {apiKey.is_active ? t('apiKeys.list.active') : t('apiKeys.list.inactive')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => revokeApiKey(apiKey.id)}
                        disabled={!apiKey.is_active}
                      >
                        <ShieldOff className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
