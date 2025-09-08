'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
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
import { Separator } from '@/components/ui/Separator'
import { InfoIcon, CheckCircleIcon, BarChartIcon, FilterIcon } from 'lucide-react'

interface FileOperationsFormProps {
  onExecute: (_operation: string, _params: any) => void
  disabled?: boolean
  translations: Record<string, any>
}

export function FileOperationsForm({ onExecute, disabled, translations }: FileOperationsFormProps) {
  const [selectedOperation, setSelectedOperation] = useState<string>('')
  const [params, setParams] = useState<{
    maxDepth: number | string
    aggregator: string
    limit: number
    minThreshold: number
    maxThreshold: number
  }>({
    maxDepth: -1,
    aggregator: 'mean',
    limit: 10,
    minThreshold: 0,
    maxThreshold: 10,
  })

  const handleExecute = () => {
    if (!selectedOperation) return

  let maxDepth: number
    if (typeof params.maxDepth === 'string') {
      if (params.maxDepth === '' || params.maxDepth === '-') {
        maxDepth = -1
      } else {
        maxDepth = parseInt(params.maxDepth)
        if (isNaN(maxDepth) || (maxDepth !== -1 && maxDepth <= 0)) {
          maxDepth = -1
        }
      }
    } else {
      maxDepth = params.maxDepth
      if (isNaN(maxDepth) || (maxDepth !== -1 && maxDepth <= 0)) {
        maxDepth = -1
      }
    }

    const validatedParams = {
      ...params,
      maxDepth,
    }

    onExecute(selectedOperation, validatedParams)
  }

  const operations = [
    {
      id: 'fileInfo',
      title: translations.docs?.requirementOperations?.fileInfoTitle,
      description: translations.docs?.requirementOperations?.fileInfoDescription,
      icon: InfoIcon,
      requiresParams: ['maxDepth', 'aggregator'],
    },
    {
      id: 'validateGraph',
      title: translations.docs?.requirementOperations?.validGraphTitle,
      description: translations.docs?.requirementOperations?.validGraphDescription,
      icon: CheckCircleIcon,
      requiresParams: ['maxDepth'],
    },
    {
      id: 'minimizeImpact',
      title: translations.docs?.requirementOperations?.minimizeImpactTitle,
      description: translations.docs?.requirementOperations?.minimizeImpactDescription,
      icon: BarChartIcon,
      requiresParams: ['maxDepth', 'aggregator', 'limit'],
    },
    {
      id: 'maximizeImpact',
      title: translations.docs?.requirementOperations?.maximizeImpactTitle,
      description: translations.docs?.requirementOperations?.maximizeImpactDescription,
      icon: BarChartIcon,
      requiresParams: ['maxDepth', 'aggregator', 'limit'],
    },
    {
      id: 'filterConfigs',
      title: translations.docs?.requirementOperations?.filterConfigsTitle,
      description: translations.docs?.requirementOperations?.filterConfigsDescription,
      icon: FilterIcon,
      requiresParams: ['maxDepth', 'aggregator', 'limit', 'minThreshold', 'maxThreshold'],
    },
  ]

  const selectedOperationData = operations.find(op => op.id === selectedOperation)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {operations.map(operation => {
          const Icon = operation.icon
          const isSelected = selectedOperation === operation.id

          return (
            <Card
              key={operation.id}
              className={`cursor-pointer transition-all hover:shadow-md h-full ${
                isSelected ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => setSelectedOperation(operation.id)}
            >
              <CardHeader className="pb-3 h-full">
                <CardTitle className="flex items-center gap-2 text-sm leading-tight">
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span className="break-words">{operation.title}</span>
                </CardTitle>
                <CardDescription className="text-xs leading-relaxed">
                  {operation.description}
                </CardDescription>
              </CardHeader>
            </Card>
          )
        })}
      </div>

      {selectedOperationData && (
        <>
          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <selectedOperationData.icon className="h-5 w-5" />
                {selectedOperationData.title}
              </CardTitle>
              <CardDescription>{selectedOperationData.description}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
              {selectedOperationData.requiresParams.includes('maxDepth') && (
                <div className="space-y-2">
                  <Label htmlFor="maxDepth">
                    {translations.docs?.requirementOperations?.maxDepthLabel}
                  </Label>
                  <Input
                    id="maxDepth"
                    type="number"
                    value={params.maxDepth}
                    step="1"
                    onChange={e => {
                      const value = e.target.value

                      if (value === '' || value === '-') {
                        setParams(prev => ({ ...prev, maxDepth: value }))
                        return
                      }

                      const numValue = parseInt(value)
                      if (numValue === 0) {
                        const currentValue =
                          typeof params.maxDepth === 'string'
                            ? parseInt(params.maxDepth) || -1
                            : params.maxDepth
                        if (currentValue === -1) {
                          setParams(prev => ({ ...prev, maxDepth: 1 }))
                        } else {
                          setParams(prev => ({ ...prev, maxDepth: -1 }))
                        }
                        return
                      }

                      if (!isNaN(numValue) && (numValue === -1 || numValue > 0)) {
                        setParams(prev => ({ ...prev, maxDepth: numValue }))
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        const currentValue =
                          typeof params.maxDepth === 'string'
                            ? parseInt(params.maxDepth) || -1
                            : params.maxDepth
                        if (currentValue === -1) {
                          setParams(prev => ({ ...prev, maxDepth: 1 }))
                        } else if (currentValue > 0) {
                          setParams(prev => ({ ...prev, maxDepth: currentValue + 1 }))
                        }
                      } else if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        const currentValue =
                          typeof params.maxDepth === 'string'
                            ? parseInt(params.maxDepth) || -1
                            : params.maxDepth
                        if (currentValue > 1) {
                          setParams(prev => ({ ...prev, maxDepth: currentValue - 1 }))
                        } else if (currentValue === 1) {
                          setParams(prev => ({ ...prev, maxDepth: -1 }))
                        }
                      }
                    }}
                    placeholder="-1"
                    min="-1"
                  />
                  <p className="text-xs text-muted-foreground">
                    {translations.docs?.requirementOperations?.maxDepthDescription}
                  </p>
                </div>
              )}

              {selectedOperationData.requiresParams.includes('aggregator') && (
                <div className="space-y-2">
                  <Label htmlFor="aggregator">
                    {translations.docs?.requirementOperations?.aggregatorLabel}
                  </Label>
                  <Select
                    value={params.aggregator}
                    onValueChange={value => setParams(prev => ({ ...prev, aggregator: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          translations.docs?.requirementOperations?.aggregatorDescription
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mean">
                        {translations.docs?.requirementOperations?.meanOption}
                      </SelectItem>
                      <SelectItem value="weighted_mean">
                        {translations.docs?.requirementOperations?.weightedMeanOption}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {translations.docs?.requirementOperations?.aggregatorDescription}
                  </p>
                </div>
              )}

              {selectedOperationData.requiresParams.includes('limit') && (
                <div className="space-y-2">
                  <Label htmlFor="limit">
                    {translations.docs?.requirementOperations?.limitLabel}
                  </Label>
                  <Input
                    id="limit"
                    type="number"
                    min="1"
                    value={params.limit}
                    onChange={e =>
                      setParams(prev => ({
                        ...prev,
                        limit: parseInt(e.target.value) || 10,
                      }))
                    }
                    placeholder="10"
                  />
                  <p className="text-xs text-muted-foreground">
                    {translations.docs?.requirementOperations?.limitDescription}
                  </p>
                </div>
              )}

              {selectedOperationData.requiresParams.includes('minThreshold') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minThreshold">
                      {translations.docs?.requirementOperations?.minThresholdLabel}
                    </Label>
                    <Input
                      id="minThreshold"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={params.minThreshold}
                      onChange={e =>
                        setParams(prev => ({
                          ...prev,
                          minThreshold: parseFloat(e.target.value) || 0,
                        }))
                      }
                      placeholder="0"
                    />
                    <p className="text-xs text-muted-foreground">
                      {translations.docs?.requirementOperations?.minThresholdDescription}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxThreshold">
                      {translations.docs?.requirementOperations?.maxThresholdLabel}
                    </Label>
                    <Input
                      id="maxThreshold"
                      type="number"
                      min="0"
                      max="10"
                      step="0.1"
                      value={params.maxThreshold}
                      onChange={e =>
                        setParams(prev => ({
                          ...prev,
                          maxThreshold: parseFloat(e.target.value) || 10,
                        }))
                      }
                      placeholder="10"
                    />
                    <p className="text-xs text-muted-foreground">
                      {translations.docs?.requirementOperations?.maxThresholdDescription}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex justify-end pt-4">
                <Button onClick={handleExecute} disabled={disabled || !selectedOperation}>
                  {disabled
                    ? translations.docs?.requirementOperations?.executing
                    : translations.docs?.requirementOperations?.executeButton}
                </Button>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
