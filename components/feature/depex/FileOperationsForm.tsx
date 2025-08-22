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
    maxLevel: number | string
    aggregator: string
    limit: number
    minThreshold: number
    maxThreshold: number
  }>({
    maxLevel: -1,
    aggregator: 'mean',
    limit: 10,
    minThreshold: 0,
    maxThreshold: 10,
  })

  const handleExecute = () => {
    if (!selectedOperation) return

    // Convert maxLevel to number and validate
    let maxLevel: number
    if (typeof params.maxLevel === 'string') {
      if (params.maxLevel === '' || params.maxLevel === '-') {
        maxLevel = -1 // Default to -1 if invalid
      } else {
        maxLevel = parseInt(params.maxLevel)
        if (isNaN(maxLevel) || (maxLevel !== -1 && maxLevel <= 0)) {
          maxLevel = -1 // Default to -1 if invalid
        }
      }
    } else {
      maxLevel = params.maxLevel
      // Validate even if it's already a number
      if (isNaN(maxLevel) || (maxLevel !== -1 && maxLevel <= 0)) {
        maxLevel = -1 // Default to -1 if invalid
      }
    }

    // Create params with validated maxLevel
    const validatedParams = {
      ...params,
      maxLevel,
    }

    onExecute(selectedOperation, validatedParams)
  }

  const operations = [
    {
      id: 'fileInfo',
      title: translations.docs?.requirementOperations?.fileInfoTitle,
      description: translations.docs?.requirementOperations?.fileInfoDescription,
      icon: InfoIcon,
      requiresParams: ['maxLevel', 'aggregator'],
    },
    {
      id: 'validateGraph',
      title: translations.docs?.requirementOperations?.validGraphTitle,
      description: translations.docs?.requirementOperations?.validGraphDescription,
      icon: CheckCircleIcon,
      requiresParams: ['maxLevel'],
    },
    {
      id: 'minimizeImpact',
      title: translations.docs?.requirementOperations?.minimizeImpactTitle,
      description: translations.docs?.requirementOperations?.minimizeImpactDescription,
      icon: BarChartIcon,
      requiresParams: ['maxLevel', 'aggregator', 'limit'],
    },
    {
      id: 'maximizeImpact',
      title: translations.docs?.requirementOperations?.maximizeImpactTitle,
      description: translations.docs?.requirementOperations?.maximizeImpactDescription,
      icon: BarChartIcon,
      requiresParams: ['maxLevel', 'aggregator', 'limit'],
    },
    {
      id: 'filterConfigs',
      title: translations.docs?.requirementOperations?.filterConfigsTitle,
      description: translations.docs?.requirementOperations?.filterConfigsDescription,
      icon: FilterIcon,
      requiresParams: ['maxLevel', 'aggregator', 'limit', 'minThreshold', 'maxThreshold'],
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
              {selectedOperationData.requiresParams.includes('maxLevel') && (
                <div className="space-y-2">
                  <Label htmlFor="maxLevel">
                    {translations.docs?.requirementOperations?.maxLevelLabel}
                  </Label>
                  <Input
                    id="maxLevel"
                    type="number"
                    value={params.maxLevel}
                    step="1"
                    onChange={e => {
                      const value = e.target.value

                      if (value === '' || value === '-') {
                        setParams(prev => ({ ...prev, maxLevel: value }))
                        return
                      }

                      const numValue = parseInt(value)
                      if (numValue === 0) {
                        const currentValue =
                          typeof params.maxLevel === 'string'
                            ? parseInt(params.maxLevel) || -1
                            : params.maxLevel
                        if (currentValue === -1) {
                          setParams(prev => ({ ...prev, maxLevel: 1 }))
                        } else {
                          setParams(prev => ({ ...prev, maxLevel: -1 }))
                        }
                        return
                      }

                      if (!isNaN(numValue) && (numValue === -1 || numValue > 0)) {
                        setParams(prev => ({ ...prev, maxLevel: numValue }))
                      }
                    }}
                    onKeyDown={e => {
                      if (e.key === 'ArrowUp') {
                        e.preventDefault()
                        const currentValue =
                          typeof params.maxLevel === 'string'
                            ? parseInt(params.maxLevel) || -1
                            : params.maxLevel
                        if (currentValue === -1) {
                          setParams(prev => ({ ...prev, maxLevel: 1 }))
                        } else if (currentValue > 0) {
                          setParams(prev => ({ ...prev, maxLevel: currentValue + 1 }))
                        }
                      } else if (e.key === 'ArrowDown') {
                        e.preventDefault()
                        const currentValue =
                          typeof params.maxLevel === 'string'
                            ? parseInt(params.maxLevel) || -1
                            : params.maxLevel
                        if (currentValue > 1) {
                          setParams(prev => ({ ...prev, maxLevel: currentValue - 1 }))
                        } else if (currentValue === 1) {
                          setParams(prev => ({ ...prev, maxLevel: -1 }))
                        }
                      }
                    }}
                    placeholder="-1"
                    min="-1"
                  />
                  <p className="text-xs text-muted-foreground">
                    {translations.docs?.requirementOperations?.maxLevelDescription}
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
