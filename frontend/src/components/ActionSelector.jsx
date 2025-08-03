import React, { useState } from 'react'
import { FileText, HelpCircle, Calendar, ChevronDown, Settings, CreditCard } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { RecaptchaWrapper } from './RecaptchaWrapper'
import { useRecaptchaContext } from './RecaptchaProvider'

const actions = [
  {
    id: 'summarize',
    title: 'Summarize',
    description: 'Create a clear, concise summary of your content',
    icon: FileText,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200'
  },
  {
    id: 'generate_questions',
    title: 'Generate Questions',
    description: 'Create study questions to test your understanding',
    icon: HelpCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200'
  },
  {
    id: 'plan_study',
    title: 'Plan Study',
    description: 'Get a structured study plan for this content',
    icon: Calendar,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-200'
  },
  {
    id: 'flashcards',
    title: 'Generate Flashcards',
    description: 'Create flashcards for active recall learning',
    icon: CreditCard,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200'
  }
]

export const ActionSelector = ({ 
  onActionSelect, 
  selectedAction, 
  textContent, 
  onProcess, 
  isLoading 
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [additionalInstructions, setAdditionalInstructions] = useState('')
  const recaptcha = useRecaptchaContext()

  const handleActionClick = (actionId) => {
    onActionSelect(actionId)
  }

  const handleProcess = async () => {
    if (selectedAction && textContent) {
      // Execute reCAPTCHA v3 before processing
      if (recaptcha.isEnabled && recaptcha.isReady) {
        try {
          const recaptchaToken = await recaptcha.execute('submit')
          onProcess(textContent, selectedAction, additionalInstructions, recaptchaToken)
        } catch (recaptchaError) {
          console.error('reCAPTCHA error:', recaptchaError)
          // Still proceed with empty token for now
          onProcess(textContent, selectedAction, additionalInstructions, '')
        }
      } else {
        onProcess(textContent, selectedAction, additionalInstructions, '')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Action Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {actions.map((action) => {
          const isSelected = selectedAction === action.id
          const Icon = action.icon

          return (
            <div
              key={action.id}
              className={`japanese-card p-6 cursor-pointer transition-all duration-300 ${
                isSelected 
                  ? 'border-yellow-600 bg-yellow-50 dark:border-yellow-500 dark:bg-yellow-900/20' 
                  : ''
              }`}
              onClick={() => handleActionClick(action.id)}
            >
              <div className="text-center space-y-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 border-2 border-foreground ${
                  isSelected ? 'bg-yellow-100 border-yellow-600 dark:bg-yellow-900 dark:border-yellow-500' : 'bg-card'
                }`}>
                  <Icon className={`w-6 h-6 ${
                    isSelected ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'
                  }`} />
                </div>
                
                <div className="space-y-2">
                                                    <h3 className={`text-lg japanese-text ${
                    isSelected ? 'text-yellow-600 dark:text-yellow-400' : 'text-foreground'
                  }`}>
                  {action.title}
                </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {action.description}
                  </p>
                </div>

                {isSelected && (
                  <div className="flex justify-center">
                    <div className="flex items-center space-x-2">
                      {isLoading ? (
                        <>
                          <div className="pixel-loader text-yellow-600 dark:text-yellow-400" style={{ width: '12px', height: '12px' }} />
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Processing...</span>
                        </>
                      ) : (
                        <>
                          <div className="w-2 h-2 bg-yellow-500 dark:bg-yellow-500 rounded-full" />
                          <span className="text-xs text-yellow-600 dark:text-yellow-400 font-medium">Selected</span>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Advanced Options */}
      {selectedAction && (
        <div className="space-y-6">
          <div className="card-clean p-6">
            <Collapsible open={showAdvanced} onOpenChange={setShowAdvanced}>
              <CollapsibleTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Settings className="w-5 h-5" />
                    <span className="font-medium">Advanced Options</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${
                    showAdvanced ? 'rotate-180' : ''
                  }`} />
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="pt-6 space-y-4">
                  <div className="space-y-3">
                    <label className="text-sm font-medium text-foreground">
                      Additional Instructions (Optional)
                    </label>
                    <Textarea
                      placeholder="Add specific requirements or preferences for the AI output..."
                      value={additionalInstructions}
                      onChange={(e) => setAdditionalInstructions(e.target.value)}
                      className="min-h-[100px] resize-none"
                    />
                    <p className="text-xs text-muted-foreground">
                      Provide specific instructions to customize the AI output format, style, or focus areas
                    </p>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          {/* Content Preview */}
          <div className="japanese-card p-6">
            <div className="flex items-center space-x-3 mb-4 relative z-10">
              <FileText className="w-5 h-5 text-gray-900" />
              <h4 className="text-lg japanese-text text-foreground">Content Preview</h4>
            </div>
            <div className="bg-muted p-4 border-2 border-border relative z-10">
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                {textContent.length > 200 
                  ? `${textContent.substring(0, 200)}...` 
                  : textContent
                }
              </p>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
                <span className="text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}>
                  {textContent.length} characters
                </span>
                <span className="text-xs text-foreground font-medium">
                  {isLoading ? (
                    <div className="flex items-center space-x-2">
                      <div className="pixel-loader text-foreground" style={{ width: '12px', height: '12px' }} />
                      <span>Processing...</span>
                    </div>
                  ) : (
                    'Ready to process'
                  )}
                </span>
              </div>
            </div>
          </div>

          {/* reCAPTCHA v3 is invisible - no UI needed */}
          <RecaptchaWrapper
            action="submit"
            onVerify={(token) => {
              // Token is automatically handled by the useRecaptcha hook
            }}
            onError={(error) => {
              console.error('reCAPTCHA error:', error)
            }}
          />

          {/* Process Button */}
          <div className="flex justify-center">
            <button
              onClick={handleProcess}
              disabled={!selectedAction || !textContent || isLoading}
              className="japanese-button text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex flex-col items-center space-y-3">
                  <div className="pixel-loader text-white mx-auto" />
                  <div className="text-center space-y-2">
                    <span className="text-sm font-medium">AI Processing...</span>
                    <div className="w-48 h-2 bg-white/20 border border-white/30 overflow-hidden">
                      <div className="retro-progress h-full bg-white/60" />
                    </div>
                  </div>
                </div>
              ) : (
                `${actions.find(a => a.id === selectedAction)?.title || 'Process'}`
              )}
            </button>
          </div>
        </div>
      )}

      {/* Selection Hint */}
      {!selectedAction && textContent && (
        <div className="text-center">
          <div className="japanese-card p-6 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-yellow-100 dark:bg-yellow-900 border-2 border-yellow-600 dark:border-yellow-500 mb-4">
              <FileText className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <h3 className="text-lg japanese-text text-yellow-600 dark:text-yellow-400 mb-2">
              Choose an Action
            </h3>
            <p className="text-sm text-muted-foreground">
              Select an action above to process your content with AI
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
