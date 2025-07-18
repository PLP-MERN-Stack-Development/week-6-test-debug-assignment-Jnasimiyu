/**
 * Error Boundary component
 * Catches and handles React errors gracefully
 */

import React from 'react'
import { AlertTriangle, RefreshCw, Home } from 'lucide-react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    console.error('🚨 Error Boundary caught an error:', error)
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error Boundary details:', {
      error: error,
      errorInfo: errorInfo,
      timestamp: new Date().toISOString()
    })
    
    this.setState({
      error: error,
      errorInfo: errorInfo
    })
  }

  handleReload = () => {
    console.log('🔄 Reloading page after error')
    window.location.reload()
  }

  handleGoHome = () => {
    console.log('🏠 Navigating to home after error')
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-center mb-4">
              <AlertTriangle className="h-16 w-16 text-error-500" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 text-center mb-6">
              We're sorry for the inconvenience. An unexpected error has occurred.
            </p>
            
            <div className="flex flex-col space-y-3">
              <button
                onClick={this.handleReload}
                className="btn-primary flex items-center justify-center space-x-2"
              >
                <RefreshCw className="h-5 w-5" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="btn-secondary flex items-center justify-center space-x-2"
              >
                <Home className="h-5 w-5" />
                <span>Go Home</span>
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 p-4 bg-gray-100 rounded-lg">
                <summary className="cursor-pointer font-medium text-gray-700 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="text-sm text-gray-600 overflow-auto">
                  {this.state.error.toString()}
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary