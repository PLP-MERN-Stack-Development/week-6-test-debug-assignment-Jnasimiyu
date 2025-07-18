/**
 * LoadingSpinner component
 * Reusable loading spinner component
 */

import React from 'react'

const LoadingSpinner = ({ className = 'h-8 w-8', color = 'border-primary-500' }) => {
  console.log('⏳ LoadingSpinner rendered')
  
  return (
    <div 
      className={`loading-spinner ${className} ${color}`} 
      role="status" 
      aria-label="Loading"
      data-testid="loading-spinner"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export default LoadingSpinner