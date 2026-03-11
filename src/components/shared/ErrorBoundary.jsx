import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
    if (this.props.onReset) {
      this.props.onReset()
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="min-h-screen flex items-center justify-center bg-background p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="bg-white p-6 rounded-lg border border-border shadow-sm max-w-md w-full">
            <h2 className="text-xl font-medium text-negative mb-3">
              Something went wrong
            </h2>
            <p className="text-neutral mb-4 text-sm">
              We encountered an error while loading the application. 
              This might be due to corrupted data or an unexpected input.
            </p>
            
            {this.state.error && (
              <div className="bg-red-50 p-3 rounded mb-4 overflow-auto max-h-32">
                <code className="text-xs text-red-800">
                  {this.state.error.toString()}
                </code>
              </div>
            )}
            
            <div className="flex gap-2">
              <button
                onClick={this.handleReset}
                className="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:bg-primary/90"
                aria-label="Try to recover and reload"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  localStorage.clear()
                  window.location.reload()
                }}
                className="flex-1 py-2 px-4 bg-gray-100 text-neutral rounded-md hover:bg-gray-200"
                aria-label="Clear all data and reload application"
              >
                Clear Data
              </button>
            </div>
            
            <p className="text-xs text-neutral mt-4 text-center">
              If the problem persists, try clearing browser data or contact support.
            </p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
