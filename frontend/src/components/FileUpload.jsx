import React, { useState, useRef, useCallback, useEffect } from 'react'
import { Upload, File, X, Check, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { useRecaptchaContext } from './RecaptchaProvider'
import { RetroTooltip } from '@/components/ui/retro-tooltip'

export const FileUpload = ({ onFileUpload }) => {
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState(null)
  const [textContent, setTextContent] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const fileInputRef = useRef(null)
  
  // reCAPTCHA v3 integration
  const recaptcha = useRecaptchaContext()

  const handleDrag = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0])
    }
  }, [])

  const handleFileSelect = async (selectedFile) => {
    setError('')
    setSuccess('')
    
    // Validate file type
    const allowedTypes = ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a PDF, TXT, or DOCX file.')
      return
    }

    // Validate file size (10MB limit)
    if (selectedFile.size > 10 * 1024 * 1024) {
      setError('File size must be less than 10MB.')
      return
    }

    setFile(selectedFile)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create FormData first
      const formData = new FormData()
      formData.append("file", selectedFile)
      formData.append("summarize_background", "true") // Enable background summarization

      // Execute reCAPTCHA v3 before upload
      if (recaptcha.isEnabled && recaptcha.isReady) {
        try {
          const recaptchaToken = await recaptcha.execute('file_upload')
          formData.append("recaptcha_token", recaptchaToken)
        } catch (recaptchaError) {
          throw new Error(`reCAPTCHA verification failed: ${recaptchaError.message}`)
        }
      } else if (recaptcha.isEnabled && !recaptcha.isReady) {
        throw new Error("reCAPTCHA is not ready yet. Please wait a moment and try again.")
      }

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + Math.random() * 20
        })
      }, 200)

      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      const response = await fetch(`${apiBaseUrl}/parse-file`, {
        method: 'POST',
        body: formData
      })

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'File parsing failed')
      }

      const data = await response.json()
      
      // Check if background summary is available
      if (data.summary_available && data.background_summary) {
        setSuccess('File parsed successfully! AI summary generated for review.')
        // Use the AI summary instead of raw text for better user experience
        onFileUpload(data.background_summary, {
          originalText: data.extracted_text,
          filename: data.filename,
          hasSummary: true,
          summaryUsed: true
        })
      } else {
        setSuccess('File parsed successfully!')
        // Use extracted text directly
        onFileUpload(data.extracted_text, {
          originalText: data.extracted_text,
          filename: data.filename,
          hasSummary: false,
          summaryUsed: false
        })
      }
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message)
      setUploadProgress(0)
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelect(e.target.files[0])
    }
  }

  const handleTextSubmit = () => {
    if (textContent.trim()) {
      setError('')
      setSuccess('Text content loaded!')
      onFileUpload(textContent)
      setTimeout(() => setSuccess(''), 3000)
    }
  }

  const clearFile = () => {
    setFile(null)
    setUploadProgress(0)
    setError('')
    setSuccess('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const clearText = () => {
    setTextContent('')
    setError('')
    setSuccess('')
  }

  // Simple keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Command + Enter (Mac) or Ctrl + Enter (Windows/Linux) to submit text
      if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault()
        if (textContent.trim() && !isUploading) {
          handleTextSubmit()
        }
      }
      
      // Escape to clear text
      if (e.key === 'Escape' && textContent) {
        e.preventDefault()
        clearText()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [textContent, isUploading])

  return (
    <div className="space-y-6">
      {/* Primary Text Input */}
      <div className="space-y-3">
        <Textarea
          placeholder="Paste your study material here or start typing your content..."
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          className="min-h-[200px] resize-none japanese-textarea text-base pixel-border"
          disabled={isUploading}
        />
          
          <div className="flex items-center justify-between">
            <div className="text-xs text-muted-foreground space-y-1">
              <p>{textContent.length} characters</p>
              <p>⌘+Enter to submit • Esc to clear</p>
            </div>
            
            <div className="flex space-x-2">
                {textContent && (
                  <RetroTooltip content="Clear text content" shortcut="escape">
                    <button
                      onClick={clearText}
                      className="japanese-button text-xs bg-background text-foreground border-foreground hover:bg-foreground hover:text-background py-0.5 px-2"
                    >
                      <X className="w-3 h-3 mr-1" />
                      Clear
                    </button>
                  </RetroTooltip>
                )}
                
                <RetroTooltip content="Submit text content" shortcut="cmd+enter">
                  <button
                    onClick={handleTextSubmit}
                    disabled={!textContent.trim() || isUploading}
                    className="japanese-button text-xs disabled:opacity-50 disabled:cursor-not-allowed py-0.5 px-2"
                  >
                    <Check className="w-3 h-3 mr-1" />
                    Use This Text
                  </button>
                </RetroTooltip>
              </div>
            </div>
          </div>


      {/* File Upload Alternative */}
      <div className="relative">
        <div className="flex items-center space-x-2 mb-4">
          <div className="h-px bg-border flex-1" />
          <span className="text-sm text-muted-foreground px-2">Or upload a file</span>
          <div className="h-px bg-border flex-1" />
        </div>

        <div
          className={`upload-zone relative border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 pixel-border ${
            dragActive ? 'border-yellow-500 bg-yellow-50 dark:border-yellow-500 dark:bg-yellow-900/20' : 'border-border'
          } ${isUploading ? 'pointer-events-none opacity-50' : 'cursor-pointer hover:border-yellow-400 dark:hover:border-yellow-400'}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.txt,.docx"
            onChange={handleFileInputChange}
            disabled={isUploading}
          />

          {isUploading ? (
            <div className="space-y-3">
              <div className="pixel-loader text-yellow-600 dark:text-yellow-500 mx-auto" />
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Uploading file...</p>
                <div className="max-w-xs mx-auto">
                  <Progress value={uploadProgress} className="h-1 retro-progress" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(uploadProgress)}%
                  </p>
                </div>
              </div>
            </div>
          ) : file ? (
            <div className="space-y-3">
              <div className="flex items-center justify-center space-x-2">
                <Check className="w-5 h-5 text-green-500" />
                <File className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              </div>
              <div>
                <p className="font-medium text-foreground text-sm">{file.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  clearFile()
                }}
                className="japanese-button text-xs bg-background text-foreground border-foreground hover:bg-foreground hover:text-background"
              >
                <X className="w-3 h-3 mr-1" />
                Remove
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <Upload className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  Drop your file here or click to browse
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Supports PDF, TXT, and DOCX files up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
          <AlertCircle className="w-4 h-4 text-red-600" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}

      {success && (
        <div className="flex items-center space-x-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <Check className="w-4 h-4 text-green-600" />
          <p className="text-sm text-green-700 dark:text-green-400">{success}</p>
        </div>
      )}
    </div>
  )
}