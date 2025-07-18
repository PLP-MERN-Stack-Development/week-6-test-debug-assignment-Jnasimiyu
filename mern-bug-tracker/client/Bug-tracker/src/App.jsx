/**
 * Main App component
 * Handles routing and global state management
 */

import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import BugList from './components/BugList'
import BugForm from './components/BugForm'
import BugDetails from './components/BugDetails'
import { BugProvider } from './context/BugContext'

function App() {
  console.log('🚀 App component rendered')
  
  return (
    <BugProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<BugList />} />
            <Route path="/new" element={<BugForm />} />
            <Route path="/edit/:id" element={<BugForm />} />
            <Route path="/bug/:id" element={<BugDetails />} />
          </Routes>
        </main>
      </div>
    </BugProvider>
  )
}

export default App