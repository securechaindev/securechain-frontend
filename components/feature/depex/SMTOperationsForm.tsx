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
import {
  CheckCircleIcon,
  BarChartIcon,
  FilterIcon,
  CheckIcon,
  FileTextIcon,
  TargetIcon,
} from 'lucide-react'

interface SMTOperationsFormProps {
  onExecute: (_operation: string, _params: any) => void
  disabled?: boolean
}

export function SMTOperationsForm({ onExecute, disabled = false }: SMTOperationsFormProps) {
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
  const [configuration, setConfiguration] = useState<string>('')
  const [partialConfiguration, setPartialConfiguration] = useState<string>('')
  const [impact, setImpact] = useState<string>('')

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

    const baseParams = {
      maxDepth,
      aggregator: params.aggregator,
    }

    switch (selectedOperation) {
      case 'validateConfig':
        if (!validateConfiguration(configuration)) {
          alert('Invalid configuration format. Please provide valid JSON.')
          return
        }
        onExecute(selectedOperation, {
          ...baseParams,
          configuration: JSON.parse(configuration),
        })
        break

      case 'completeConfig':
        if (!validateConfiguration(partialConfiguration)) {
          alert('Invalid partial configuration format. Please provide valid JSON.')
          return
        }
        onExecute(selectedOperation, {
          ...baseParams,
          partialConfiguration: JSON.parse(partialConfiguration),
        })
        break

      case 'configByImpact':
        if (!impact.trim()) {
          alert('Impact value is required')
          return
        }

        const impactValue = parseFloat(impact.trim())
        if (isNaN(impactValue) || impactValue < 0 || impactValue > 10) {
          alert('Impact must be between 0 and 10')
          return
        }

        onExecute(selectedOperation, {
          ...baseParams,
          impact: impactValue,
        })
        break

      case 'validateGraph':
      case 'minimizeImpact':
      case 'maximizeImpact':
        onExecute(selectedOperation, {
          ...baseParams,
          ...(selectedOperation !== 'validateGraph' && { limit: params.limit }),
        })
        break

      case 'filterConfigs':
        onExecute(selectedOperation, {
          ...baseParams,
          limit: params.limit,
          minThreshold: params.minThreshold,
          maxThreshold: params.maxThreshold,
        })
        break
    }
  }

  const isValidImpact = () => {
    if (selectedOperation !== 'configByImpact') return true
    if (!impact.trim()) return false
    const impactValue = parseFloat(impact.trim())
    return !isNaN(impactValue) && impactValue >= 0 && impactValue <= 10
  }

  const canExecute = selectedOperation && isValidImpact() && !disabled

  const operations = [
    {
      id: 'validateGraph',
      title: 'Validate Graph',
      description: 'Validate a dependency graph for a requirement file',
      icon: CheckCircleIcon,
      requiresParams: ['maxDepth'],
    },
    {
      id: 'minimizeImpact',
      title: 'Minimize Impact',
      description: 'Find configurations that minimize dependency impact',
      icon: BarChartIcon,
      requiresParams: ['maxDepth', 'aggregator', 'limit'],
    },
    {
      id: 'maximizeImpact',
      title: 'Maximize Impact',
      description: 'Find configurations that maximize dependency impact',
      icon: BarChartIcon,
      requiresParams: ['maxDepth', 'aggregator', 'limit'],
    },
    {
      id: 'filterConfigs',
      title: 'Filter Configs',
      description: 'Filter configurations based on impact thresholds',
      icon: FilterIcon,
      requiresParams: ['maxDepth', 'aggregator', 'limit', 'minThreshold', 'maxThreshold'],
    },
    {
      id: 'validateConfig',
      title: 'Validate Config',
      description: 'Validate a specific configuration',
      icon: CheckIcon,
      requiresParams: ['maxDepth', 'aggregator', 'configuration'],
    },
    {
      id: 'completeConfig',
      title: 'Complete Config',
      description: 'Complete a partial configuration with optimal values',
      icon: FileTextIcon,
      requiresParams: ['maxDepth', 'aggregator', 'partialConfiguration'],
    },
    {
      id: 'configByImpact',
      title: 'Config By Impact',
      description: 'Get configuration recommendations based on impact level',
      icon: TargetIcon,
      requiresParams: ['maxDepth', 'aggregator', 'impact'],
    },
  ]

  const selectedOperationData = operations.find(op => op.id === selectedOperation)

  return (
    <div className="space-y-6">
      {/* Operation Selection */}
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

      {/* Parameters */}
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
              {/* Common Parameters */}
              {selectedOperationData.requiresParams.includes('maxDepth') && (
                <div className="space-y-2">
                  <Label htmlFor="maxDepth">{'Max Depth'}</Label>
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
                    {'Maximum depth for dependency traversal (-1 for unlimited)'}
                  </p>
                </div>
              )}

              {selectedOperationData.requiresParams.includes('aggregator') && (
                <div className="space-y-2">
                  <Label htmlFor="aggregator">{'Aggregator'}</Label>
                  <Select
                    value={params.aggregator}
                    onValueChange={value => setParams(prev => ({ ...prev, aggregator: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={'Aggregation method for impact calculation'} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mean">{'Mean'}</SelectItem>
                      <SelectItem value="weighted_mean">{'Weighted Mean'}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {'Aggregation method for impact calculation'}
                  </p>
                </div>
              )}

              {selectedOperationData.requiresParams.includes('limit') && (
                <div className="space-y-2">
                  <Label htmlFor="limit">{'Limit'}</Label>
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
                    {'Maximum number of results to return'}
                  </p>
                </div>
              )}

              {selectedOperationData.requiresParams.includes('minThreshold') && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minThreshold">{'Min Threshold'}</Label>
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
                    <p className="text-xs text-muted-foreground">{'Minimum impact threshold'}</p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxThreshold">{'Max Threshold'}</Label>
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
                    <p className="text-xs text-muted-foreground">{'Maximum impact threshold'}</p>
                  </div>
                </div>
              )}

              {/* Operation-specific Parameters */}
              {selectedOperationData.requiresParams.includes('configuration') && (
                <div className="space-y-2">
                  <Label htmlFor="configuration">{'Configuration'}</Label>
                  <Textarea
                    id="configuration"
                    value={configuration}
                    onChange={e => setConfiguration(e.target.value)}
                    placeholder='{"pkg:pypi/package1": "1.0.0", "pkg:pypi/package2": "2.0.0"}'
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {'Enter a valid JSON configuration object'}
                  </p>
                </div>
              )}

              {selectedOperationData.requiresParams.includes('partialConfiguration') && (
                <div className="space-y-2">
                  <Label htmlFor="partialConfiguration">{'Partial Configuration'}</Label>
                  <Textarea
                    id="partialConfiguration"
                    value={partialConfiguration}
                    onChange={e => setPartialConfiguration(e.target.value)}
                    placeholder='{"pkg:pypi/package1": "1.0.0"}'
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {'Enter a partial JSON configuration to be completed'}
                  </p>
                </div>
              )}

              {selectedOperationData.requiresParams.includes('impact') && (
                <div className="space-y-2">
                  <Label htmlFor="impact">{'Impact'}</Label>
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
                    {'Enter an impact value between 0 and 10'}
                  </p>
                  {!isValidImpact() && impact.trim() && (
                    <p className="text-xs text-red-500">{'Impact must be between 0 and 10'}</p>
                  )}
                </div>
              )}

              {/* Execute Button */}
              <div className="flex justify-end pt-4">
                <Button onClick={handleExecute} disabled={!canExecute} className="min-w-32">
                  {disabled ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {'Executing...'}
                    </>
                  ) : (
                    'Execute Operation'
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
