/**
 * Header component
 * Navigation and branding
 */

import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bug, Plus, List } from 'lucide-react'

const Header = () => {
  const location = useLocation()
  
  console.log('🧭 Header rendered, current path:', location.pathname)
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 text-primary-600 hover:text-primary-700 transition-colors">
            <Bug className="h-8 w-8" />
            <h1 className="text-2xl font-bold">Bug Tracker</h1>
          </Link>
          
          <nav className="flex items-center space-x-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <List className="h-5 w-5" />
              <span>All Bugs</span>
            </Link>
            
            <Link
              to="/new"
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                location.pathname === '/new' 
                  ? 'bg-primary-100 text-primary-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Report Bug</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header