import React, { useState } from 'react'
import { FileUpload } from './components/FileUpload'
import { ActionSelector } from './components/ActionSelector'
import { ResultDisplay } from './components/ResultDisplay'
import { Header } from './components/Header'
import { Footer } from './components/Footer'
import { RecaptchaWrapper } from './components/RecaptchaWrapper'
import { RecaptchaProvider } from './components/RecaptchaProvider'
import { Toaster } from '@/components/ui/sonner'
import './App.css'

function App() {
  const [uploadedContent, setUploadedContent] = useState('')
  const [selectedAction, setSelectedAction] = useState('')
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  
  // Progressive disclosure state
  const [showHero, setShowHero] = useState(true)
  const [showFileUpload, setShowFileUpload] = useState(true)
  const [showActionSelector, setShowActionSelector] = useState(true)
  const [showResults, setShowResults] = useState(false)
  
  const handleFileUpload = (content) => {
    setUploadedContent(content)
    setResult(null)
    setError(null)
    setSelectedAction('')
    setShowResults(false)
    setShowActionSelector(true)
  }

  const handleActionSelect = (action) => {
    setSelectedAction(action)
    setResult(null)
    setError(null)
    setShowResults(false)
  }

  const handleProcess = async (textContent, action, additionalInstructions = '', recaptchaToken = '') => {
    setIsLoading(true)
    setError(null)
    setResult(null)
    
    // Progressive disclosure: collapse previous sections
    setShowHero(false)
    setShowFileUpload(false)
    setShowActionSelector(false)
    setShowResults(true)

    try {
       const requestBody = {
        action: action,
        text_content: textContent,
        additional_instructions: additionalInstructions
      }

      // Add reCAPTCHA token if provided
      if (recaptchaToken) {
        requestBody.recaptcha_token = recaptchaToken
      }
      
      const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      const response = await fetch(`${apiBaseUrl}/process`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Processing failed')
      }

      const data = await response.json()
      setResult(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleReset = () => {
    setUploadedContent('')
    setSelectedAction('')
    setResult(null)
    setError(null)
    setIsLoading(false)
    setShowHero(true)
    setShowFileUpload(true)
    setShowActionSelector(true)
    setShowResults(false)
  }

  return (
    <RecaptchaProvider>
      <div className="min-h-screen bg-background relative">
        {/* Gridded background overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: `
            linear-gradient(rgba(0, 0, 0, 0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0, 0, 0, 0.02) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0'
        }}></div>
        
        {/* Dark mode gridded background overlay */}
        <div className="absolute inset-0 pointer-events-none dark:block hidden" style={{
          backgroundImage: `
            linear-gradient(rgba(235, 219, 178, 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(235, 219, 178, 0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
          backgroundPosition: '0 0'
        }}></div>
        
        <Header />
        
        <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
          <div className="space-y-8">
            {/* Hero Section */}
            {showHero && (
              <section className="min-h-screen flex items-center justify-center py-20">
                <div className="max-w-6xl mx-auto text-center space-y-12">
                  {/* Main Title */}
                  <div className="space-y-8 animate-fade-in-up">
                    <div className="space-y-4">
                      <h1 className="text-5xl md:text-7xl font-bold text-foreground tracking-tight">
                        StudentsAI
                      </h1>
                      <div className="w-32 h-1 bg-foreground mx-auto"></div>
                    </div>
                    <p className="text-2xl md:text-3xl text-muted-foreground font-light max-w-4xl mx-auto leading-relaxed">
                      Your study materials, reimagined
                    </p>
                  </div>

                  {/* Demo Section */}
                  <div className="mt-20 animate-fade-in-up animate-delay-1">
                    <div className="text-center mb-12">
                      <h2 className="text-2xl japanese-text text-foreground mb-4">From Complex to Clear</h2>
                      <p className="text-muted-foreground max-w-2xl mx-auto">
                        Turn dense research into study-ready content
                      </p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Interactive Demo Cards */}
                      <div className="space-y-4">
                        <div className="japanese-card p-6 h-64 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg japanese-text text-foreground">Sample Input</h3>
                              <div className="pixel-loader text-foreground" style={{ width: '16px', height: '16px' }} />
                            </div>
                                                          <div className="flex-1 bg-muted p-4 border-2 border-border text-left">
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                  <span className="text-foreground font-medium">Complex Research Paper:</span> The quantum mechanical principles underlying electron transport in photosynthetic systems demonstrate remarkable efficiency through coherent energy transfer mechanisms. Recent spectroscopic studies reveal that quantum coherence persists for hundreds of femtoseconds, enabling near-unity quantum efficiency in light harvesting complexes. This discovery challenges traditional models of energy transfer and opens new possibilities for artificial photosynthesis and quantum computing applications...
                                </p>
                              </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="japanese-card p-6 h-64 relative overflow-hidden group">
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/20 dark:to-gray-800/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          <div className="relative z-10 h-full flex flex-col">
                            <div className="flex items-center justify-between mb-4">
                              <h3 className="text-lg japanese-text text-foreground">AI Output</h3>
                              <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                              </div>
                            </div>
                            <div className="flex-1 bg-muted p-4 border-2 border-border text-left">
                              <p className="text-sm text-muted-foreground leading-relaxed">
                                <span className="text-foreground font-medium">Generated Questions:</span><br/>
                                1. How does quantum coherence contribute to photosynthesis efficiency?<br/>
                                2. What are the implications of femtosecond coherence for artificial photosynthesis?<br/>
                                3. How might this research impact quantum computing development?
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Interactive Feature Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
                    <div className="japanese-card p-6 group cursor-pointer hover:scale-105 transition-transform duration-300 animate-slide-in-left animate-delay-2">
                      <div className="space-y-4">
                        <div className="text-3xl japanese-text text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">01</div>
                        <h3 className="text-lg japanese-text text-foreground">Summarize</h3>
                        <p className="text-sm text-muted-foreground">
                          Extract key insights from your content
                        </p>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                            Perfect for: Long articles, research papers, textbook chapters
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="japanese-card p-6 group cursor-pointer hover:scale-105 transition-transform duration-300 animate-fade-in-up animate-delay-3">
                      <div className="space-y-4">
                        <div className="text-3xl japanese-text text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">02</div>
                        <h3 className="text-lg japanese-text text-foreground">Generate</h3>
                        <p className="text-sm text-muted-foreground">
                          Create study questions and flashcards
                        </p>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                            Perfect for: Exam prep, active recall, self-assessment
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="japanese-card p-6 group cursor-pointer hover:scale-105 transition-transform duration-300 animate-slide-in-right animate-delay-4">
                      <div className="space-y-4">
                        <div className="text-3xl japanese-text text-foreground group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">03</div>
                        <h3 className="text-lg japanese-text text-foreground">Plan</h3>
                        <p className="text-sm text-muted-foreground">
                          Build structured study plans
                        </p>
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <p className="text-xs text-orange-600 dark:text-orange-400 font-medium">
                            Perfect for: Course planning, time management, goal setting
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Call to Action */}
                  <div className="mt-16 space-y-6 animate-fade-in-up animate-delay-5">
                    <p className="text-lg text-muted-foreground">
                      Ready to enhance your learning experience?
                    </p>
                    <button
                      onClick={() => {
                        setShowHero(false)
                        setShowFileUpload(true)
                      }}
                                              className="japanese-button text-lg"
                    >
                      Get Started
                    </button>
                  </div>
                </div>
              </section>
            )}

            {/* File Upload Section */}
            {showFileUpload && (
              <section className="space-y-4 animate-fade-in-up">
                <div className="japanese-card p-8">
                  <div className="text-center space-y-4">
                    <h2 className="text-2xl japanese-text text-foreground">Upload Your Content</h2>
                    <div className="w-16 h-1 bg-foreground mx-auto"></div>
                    <p className="text-muted-foreground">
                      Upload a document or paste text to get started
                    </p>
                  </div>
                  <div className="mt-8">
                    <FileUpload onFileUpload={handleFileUpload} />
                  </div>
                </div>
              </section>
            )}

            {/* Action Selector Section */}
            {showActionSelector && uploadedContent && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="text-center space-y-4">
                  <h2 className="text-2xl japanese-text text-foreground">Choose Your AI Action</h2>
                  <div className="w-16 h-1 bg-foreground mx-auto"></div>
                  <p className="text-muted-foreground">
                    Select how you'd like to process your content
                  </p>
                </div>
                <ActionSelector
                  onActionSelect={handleActionSelect}
                  selectedAction={selectedAction}
                  textContent={uploadedContent}
                  onProcess={handleProcess}
                  isLoading={isLoading}
                />
              </section>
            )}

            {/* Results Section */}
            {showResults && (result || error || isLoading) && (
              <section className="space-y-6 animate-fade-in-up">
                <div className="text-center mb-6">
                  <button
                    onClick={handleReset}
                    className="japanese-button"
                  >
                    Start Over
                  </button>
                </div>
                <ResultDisplay
                  result={result}
                  error={error}
                  isLoading={isLoading}
                />
              </section>
            )}
          </div>
        </main>

        <Footer />
        <Toaster />
        <RecaptchaWrapper />
      </div>
    </RecaptchaProvider>
  )
}

export default App
