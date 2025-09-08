'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select'
import { Separator } from '@/components/ui/Separator'
import { CheckIcon, FileTextIcon, TargetIcon } from 'lucide-react'

interface ConfigOperationsFormProps {
  onExecute: (_operation: string, _params: any) => void
  disabled?: boolean
  translations: Record<string, any>
}

export function ConfigOperationsForm({
  onExecute,
  disabled = false,
  translations,
}: ConfigOperationsFormProps) {
  const [selectedOperation, setSelectedOperation] = useState<string>('')
  const [maxDepth, setMaxDepth] = useState<string>('-1')
  const [aggregator, setAggregator] = useState<string>('mean')
  const [configuration, setConfiguration] = useState<string>('')
  const [partialConfiguration, setPartialConfiguration] = useState<string>('')
  const [impact, setImpact] = useState<string>('')

  const handleMaxDepthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value

    if (value === '') {
      setMaxDepth('')
      return
    }

    const numValue = parseInt(value)

    if (numValue === -1 || numValue > 0) {
      setMaxDepth(value)
    }
  }

  const validateConfiguration = (config: string): boolean => {
    if (!config.trim()) return false

    try {
      JSON.parse(config)
      return true
    } catch {
      return false
    }
  }

  const handleExecute = () => {
    if (!selectedOperation || maxDepth === '') return

    const baseParams = {
      maxDepth: parseInt(maxDepth),
      aggregator,
    }

    switch (selectedOperation) {
      case 'validateConfig':
        if (!validateConfiguration(configuration)) {
          alert(translations.docs?.requirementOperations?.invalidConfigurationFormat)
          return
        }
        onExecute(selectedOperation, {
          ...baseParams,
          configuration: JSON.parse(configuration),
        })
        break

      case 'completeConfig':
        if (!validateConfiguration(partialConfiguration)) {
          alert(translations.docs?.requirementOperations?.invalidPartialConfigurationFormat)
          return
        }
        onExecute(selectedOperation, {
          ...baseParams,
          partialConfiguration: JSON.parse(partialConfiguration),
        })
        break

      case 'configByImpact':
        if (!impact.trim()) {
          alert(translations.docs?.requirementOperations?.impactRequired)
          return
        }

        const impactValue = parseFloat(impact.trim())
        if (isNaN(impactValue) || impactValue < 0 || impactValue > 10) {
          alert(translations.docs?.requirementOperations?.impactRangeError)
          return
        }

        onExecute(selectedOperation, {
          ...baseParams,
          impact: impactValue,
        })
        break
    }
  }

  const isValidMaxDepth = maxDepth === '' || maxDepth === '-1' || parseInt(maxDepth) > 0

  const isValidImpact = () => {
    if (selectedOperation !== 'configByImpact') return true
    if (!impact.trim()) return false
    const impactValue = parseFloat(impact.trim())
    return !isNaN(impactValue) && impactValue >= 0 && impactValue <= 10
  }

  const canExecute =
    selectedOperation && maxDepth !== '' && isValidMaxDepth && isValidImpact() && !disabled

  return (
    <div className="space-y-6">
      {/* Operation Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          className={`cursor-pointer transition-all hover:shadow-md h-full ${
            selectedOperation === 'validateConfig' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedOperation('validateConfig')}
        >
          <CardHeader className="pb-3 h-full">
            <CardTitle className="flex items-center gap-2 text-sm leading-tight">
              <CheckIcon className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">
                {translations.docs?.requirementOperations?.validConfigTitle}
              </span>
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              {translations.docs?.requirementOperations?.validConfigDescription}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md h-full ${
            selectedOperation === 'completeConfig' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedOperation('completeConfig')}
        >
          <CardHeader className="pb-3 h-full">
            <CardTitle className="flex items-center gap-2 text-sm leading-tight">
              <FileTextIcon className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">
                {translations.docs?.requirementOperations?.completeConfigTitle}
              </span>
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              {translations.docs?.requirementOperations?.completeConfigDescription}
            </CardDescription>
          </CardHeader>
        </Card>

        <Card
          className={`cursor-pointer transition-all hover:shadow-md h-full ${
            selectedOperation === 'configByImpact' ? 'ring-2 ring-primary' : ''
          }`}
          onClick={() => setSelectedOperation('configByImpact')}
        >
          <CardHeader className="pb-3 h-full">
            <CardTitle className="flex items-center gap-2 text-sm leading-tight">
              <TargetIcon className="h-4 w-4 flex-shrink-0" />
              <span className="break-words">
                {translations.docs?.requirementOperations?.configByImpactTitle}
              </span>
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              {translations.docs?.requirementOperations?.configByImpactDescription}
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Parameters */}
      {selectedOperation && (
        <>
          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {selectedOperation === 'validateConfig' && <CheckIcon className="h-5 w-5" />}
                {selectedOperation === 'completeConfig' && <FileTextIcon className="h-5 w-5" />}
                {selectedOperation === 'configByImpact' && <TargetIcon className="h-5 w-5" />}
                {selectedOperation === 'validateConfig' &&
                  translations.docs?.requirementOperations?.validConfigTitle}
                {selectedOperation === 'completeConfig' &&
                  translations.docs?.requirementOperations?.completeConfigTitle}
                {selectedOperation === 'configByImpact' &&
                  translations.docs?.requirementOperations?.configByImpactTitle}
              </CardTitle>
              <CardDescription>
                {selectedOperation === 'validateConfig' &&
                  translations.docs?.requirementOperations?.validConfigDescription}
                {selectedOperation === 'completeConfig' &&
                  translations.docs?.requirementOperations?.completeConfigDescription}
                {selectedOperation === 'configByImpact' &&
                  translations.docs?.requirementOperations?.configByImpactDescription}
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Common Parameters */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="maxDepth">
                    {translations.docs?.requirementOperations?.maxDepthLabel}
                  </Label>
                  <Input
                    id="maxDepth"
                    type="number"
                    value={maxDepth}
                    onChange={handleMaxDepthChange}
                    placeholder="-1"
                    className={!isValidMaxDepth ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-muted-foreground">
                    {translations.docs?.requirementOperations?.maxDepthHelp}
                  </p>
                  {!isValidMaxDepth && (
                    <p className="text-xs text-red-500">
                      {translations.docs?.requirementOperations?.maxDepthError}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aggregator">
                    {translations.docs?.requirementOperations?.aggregatorLabel}
                  </Label>
                  <Select value={aggregator} onValueChange={setAggregator}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mean">
                        {translations.docs?.requirementOperations?.aggregatorMean}
                      </SelectItem>
                      <SelectItem value="weighted_mean">
                        {translations.docs?.requirementOperations?.weightedMeanOption}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Operation-specific Parameters */}
              {selectedOperation === 'validateConfig' && (
                <div className="space-y-2">
                  <Label htmlFor="configuration">
                    {translations.docs?.requirementOperations?.configurationLabel}
                  </Label>
                  <Textarea
                    id="configuration"
                    value={configuration}
                    onChange={e => setConfiguration(e.target.value)}
                    placeholder='{"package1": "1.0.0", "package2": "2.0.0"}'
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {translations.docs?.requirementOperations?.configurationHelp}
                  </p>
                </div>
              )}

              {selectedOperation === 'completeConfig' && (
                <div className="space-y-2">
                  <Label htmlFor="partialConfiguration">
                    {translations.docs?.requirementOperations?.partialConfigurationLabel}
                  </Label>
                  <Textarea
                    id="partialConfiguration"
                    value={partialConfiguration}
                    onChange={e => setPartialConfiguration(e.target.value)}
                    placeholder='{"package1": "1.0.0"}'
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {translations.docs?.requirementOperations?.partialConfigurationHelp}
                  </p>
                </div>
              )}

              {selectedOperation === 'configByImpact' && (
                <div className="space-y-2">
                  <Label htmlFor="impact">
                    {translations.docs?.requirementOperations?.impactLabel}
                  </Label>
                  <Input
                    id="impact"
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={impact}
                    onChange={e => setImpact(e.target.value)}
                    placeholder="5.0"
                    className={!isValidImpact() && impact.trim() ? 'border-red-500' : ''}
                  />
                  <p className="text-xs text-muted-foreground">
                    {translations.docs?.requirementOperations?.impactHelp}
                  </p>
                  {!isValidImpact() && impact.trim() && (
                    <p className="text-xs text-red-500">
                      {translations.docs?.requirementOperations?.impactRangeError}
                    </p>
                  )}
                </div>
              )}

              {/* Execute Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleExecute} disabled={!canExecute} className="min-w-32">
                  {disabled ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {translations.docs?.requirementOperations?.executing}
                    </>
                  ) : (
                    translations.docs?.requirementOperations?.executeOperation
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
