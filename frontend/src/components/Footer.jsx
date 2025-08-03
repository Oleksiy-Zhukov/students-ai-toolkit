import React from 'react'
import { Heart, Github, ExternalLink, Linkedin, Coffee, User } from 'lucide-react'

export const Footer = () => {
  return (
    <footer className="bg-gray-50 border-t mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-8 md:grid-cols-4">
          {/* Project Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-foreground">StudentsAI</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              A modern, extensible web-based AI toolkit designed specifically for students. 
              Built with React, FastAPI, and powered by cutting-edge AI models.
            </p>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>MVP - Extensible & Open Source</span>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Features</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-yellow-600 dark:bg-yellow-500 rounded-full" />
                <span>AI-powered content summarization</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-yellow-600 dark:bg-yellow-500 rounded-full" />
                <span>Intelligent question generation</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-yellow-600 dark:bg-yellow-500 rounded-full" />
                <span>Personalized study planning</span>
              </li>
              <li className="flex items-center space-x-2">
                <div className="w-1 h-1 bg-yellow-600 dark:bg-yellow-500 rounded-full" />
                <span>Dual AI backend support</span>
              </li>
            </ul>
          </div>

          {/* Tech Stack */}
          <div className="space-y-4">
            <h3 className="font-semibold text-foreground">Built With</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <div className="space-y-1">
                <div>React 19</div>
                <div>Tailwind CSS</div>
                <div>shadcn/ui</div>
                <div>Vite</div>
              </div>
              <div className="space-y-1">
                <div>FastAPI</div>
                <div>OpenAI API</div>
                <div>HuggingFace</div>
                <div>Python</div>
              </div>
            </div>
            
            <div className="flex space-x-3 pt-2">
              <a
                href="https://github.com/Oleksiy-Zhukov/students-ai-toolkit"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
              >
                <Github className="w-4 h-4" />
                <span>Source Code</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Author Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
              <h3 className="font-semibold text-foreground">Author</h3>
            </div>
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                Created by <span className="font-medium text-foreground">Oleksii Zhukov</span>
              </p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                This project is open source and I'm paying for API calls and hosting from my own pocket. 
                Your support helps keep this tool free for students!
              </p>
              
              {/* Social Links */}
              <div className="flex flex-col space-y-2">
                <a
                  href="https://github.com/Oleksiy-Zhukov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                
                <a
                  href="https://www.linkedin.com/in/oleksiizhukov/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm text-muted-foreground hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                  <span>LinkedIn</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
                
                <a
                  href="https://buymeacoffee.com/oleksiizh"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-sm bg-yellow-100 text-yellow-700 hover:bg-yellow-200 transition-colors px-3 py-2 rounded-lg border border-yellow-200"
                >
                  <Coffee className="w-4 h-4" />
                  <span>Buy me a coffee</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-8 pt-6 flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <span>Built with</span>
            <Heart className="w-4 h-4 text-red-500 fill-current" />
            <span>for students everywhere by Oleksii Zhukov</span>
          </div>

          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span>Backend: OpenAI</span>
            <div className="w-1 h-1 bg-gray-400 rounded-full" />
            <span>© 2025 StudentsAI</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

