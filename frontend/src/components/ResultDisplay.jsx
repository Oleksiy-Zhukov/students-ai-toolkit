import React, { useState, useRef } from 'react'
import { Copy, Download, CheckCircle, AlertCircle, FileText, HelpCircle, Calendar, RefreshCw, CreditCard } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'

const actionIcons = {
  summarize: FileText,
  generate_questions: HelpCircle,
  plan_study: Calendar,
  flashcards: CreditCard
}

const actionTitles = {
  summarize: 'Summary',
  generate_questions: 'Study Questions',
  plan_study: 'Study Plan',
  flashcards: 'Flashcards'
}

const actionColors = {
  summarize: 'text-blue-600 bg-blue-50 border-blue-200',
  generate_questions: 'text-green-600 bg-green-50 border-green-200',
  plan_study: 'text-purple-600 bg-purple-50 border-purple-200',
  flashcards: 'text-orange-600 bg-orange-50 border-orange-200'
}

export const ResultDisplay = ({ result, error, isLoading }) => {
  const [copySuccess, setCopySuccess] = useState(false)
  const [downloadSuccess, setDownloadSuccess] = useState(false)
  const contentRef = useRef(null)

  const handleCopy = async () => {
    if (result?.result) {
      try {
        await navigator.clipboard.writeText(result.result)
        setCopySuccess(true)
        setTimeout(() => setCopySuccess(false), 2000)
      } catch (err) {
        console.error('Failed to copy text:', err)
      }
    }
  }

  const handleDownload = () => {
    if (result?.result) {
      const actionTitle = actionTitles[result.action] || 'Result'
      const timestamp = new Date().toISOString().split('T')[0]
      const filename = `${actionTitle.toLowerCase().replace(' ', '_')}_${timestamp}.txt`
      
      const blob = new Blob([result.result], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setDownloadSuccess(true)
      setTimeout(() => setDownloadSuccess(false), 2000)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="japanese-card p-12">
          <div className="flex flex-col items-center space-y-8">
            <div className="pixel-loader text-foreground" style={{ width: '32px', height: '32px' }} />
            <div className="text-center space-y-4">
              <h3 className="text-xl japanese-text text-foreground">AI Processing Your Content</h3>
              <p className="text-sm text-muted-foreground max-w-md leading-relaxed">
                Our AI is analyzing your content and generating the requested output. 
                This may take a few moments.
              </p>
            </div>
            
            {/* Console-style Progress Bar */}
            <div className="w-full max-w-md space-y-3">
              <div className="console-progress w-full h-4">
                {/* Progress bar fills automatically via CSS */}
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }}>
                <span>Processing...</span>
                <span>Using {result?.backend || 'AI'} backend</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="japanese-card p-8 border-red-600 bg-red-50">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <div className="w-12 h-12 border-2 border-red-600 bg-card flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
            <div className="space-y-4 flex-1">
              <div>
                <h3 className="text-xl font-semibold text-red-600 mb-2">Processing Error</h3>
                <p className="text-sm text-red-700 leading-relaxed">{error}</p>
              </div>
              <div className="flex space-x-3">
                <Button
                  variant="outline"
                  onClick={() => window.location.reload()}
                  className="border-red-200 text-red-600 hover:bg-red-50"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => window.history.back()}
                >
                  Go Back
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!result) {
    return null
  }

  const ActionIcon = actionIcons[result.action] || FileText
  const actionTitle = actionTitles[result.action] || 'Result'
  const actionColor = actionColors[result.action] || actionColors.summarize

  return (
    <div className="space-y-6">
      {/* Result Header */}
      <div className="japanese-card p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="p-3 border-2 border-foreground bg-card">
              <ActionIcon className="w-6 h-6 text-foreground" />
            </div>
            <div>
              <h2 className="text-2xl japanese-text text-foreground">{actionTitle}</h2>
              <p className="text-sm text-muted-foreground">
                Generated on {formatDate(new Date())}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleCopy}
              className={`japanese-button text-sm ${copySuccess ? 'bg-green-600 border-green-600 text-white' : ''}`}
            >
              <Copy className="w-4 h-4 mr-2" />
              {copySuccess ? 'Copied!' : 'Copy'}
            </button>
            
            <button
              onClick={handleDownload}
              className={`japanese-button text-sm ${downloadSuccess ? 'bg-green-600 border-green-600 text-white' : ''}`}
            >
              <Download className="w-4 h-4 mr-2" />
              {downloadSuccess ? 'Downloaded!' : 'Download'}
            </button>
          </div>
        </div>
      </div>

      {/* Result Content */}
      <div className="japanese-card p-8">
        <div
          ref={contentRef}
          className="prose prose-lg max-w-none"
        >
          <ReactMarkdown 
            remarkPlugins={[remarkGfm]}
            className="text-foreground leading-relaxed"
            components={{
              h1: ({node, ...props}) => (
                <h1 className="text-3xl font-bold mb-6 text-foreground border-b border-border pb-2" {...props} />
              ),
              h2: ({node, ...props}) => (
                <h2 className="text-2xl font-semibold mb-4 text-foreground mt-8 first:mt-0" {...props} />
              ),
              h3: ({node, ...props}) => (
                <h3 className="text-xl font-medium mb-3 text-foreground mt-6" {...props} />
              ),
              p: ({node, ...props}) => (
                <p className="mb-4 text-foreground leading-relaxed" {...props} />
              ),
              ul: ({node, ...props}) => (
                <ul className="list-disc list-inside mb-4 space-y-2 ml-4" {...props} />
              ),
              ol: ({node, ...props}) => (
                <ol className="list-decimal list-inside mb-4 space-y-2 ml-4" {...props} />
              ),
              li: ({node, ...props}) => (
                <li className="text-foreground leading-relaxed" {...props} />
              ),
              strong: ({node, ...props}) => (
                <strong className="font-semibold text-foreground" {...props} />
              ),
              em: ({node, ...props}) => (
                <em className="italic text-foreground" {...props} />
              ),
              code: ({node, inline, ...props}) => 
                inline ? (
                  <code className="bg-muted px-2 py-1 rounded-md text-sm text-yellow-600 dark:text-yellow-400" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }} {...props} />
                ) : (
                  <code className="block bg-muted p-4 rounded-lg text-sm overflow-x-auto border border-border" style={{ fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace" }} {...props} />
                ),
              blockquote: ({node, ...props}) => (
                <blockquote className="border-l-4 border-yellow-500 pl-4 italic text-muted-foreground mb-4 bg-gray-50 py-2 rounded-r-lg" {...props} />
              ),
                              a: ({node, ...props}) => (
                  <a className="text-yellow-600 dark:text-yellow-400 hover:text-yellow-800 dark:hover:text-yellow-300 underline" {...props} />
                ),
            }}
          >
            {result.result}
          </ReactMarkdown>
        </div>
      </div>

      {/* Backend Info */}
      <div className="flex items-center justify-between text-sm text-muted-foreground bg-gray-50 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <CheckCircle className="w-4 h-4 text-green-500" />
          <span>Generated successfully</span>
        </div>
        
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="font-medium">Backend:</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-md text-xs font-medium">
              {result.backend}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="font-medium">Characters:</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
              {result.result.length.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Success Feedback */}
      {(copySuccess || downloadSuccess) && (
        <div className="fixed bottom-6 right-6 bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg z-50 flex items-center space-x-3">
          <CheckCircle className="w-5 h-5" />
          <span className="font-medium">
            {copySuccess ? 'Copied to clipboard!' : 'Downloaded successfully!'}
          </span>
        </div>
      )}
    </div>
  )
}

