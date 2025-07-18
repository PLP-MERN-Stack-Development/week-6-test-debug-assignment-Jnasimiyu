import React, { useContext } from 'react'
import { BugContext } from '../context/BugContext'

const BugList = () => {
  const { bugs, loading, error, filter, sortBy, sortOrder } = useContext(BugContext)

  console.log('🐛 BugList component rendered', bugs)

  if (loading) return <p>Loading bugs...</p>
  if (error) return <p>Error loading bugs: {error}</p>
  if (!bugs || bugs.length === 0) return <p>No bugs found.</p>

  const filteredBugs = bugs.filter(bug => {
    if (filter === 'all') return true
    return bug.status === filter
  })

  const sortedBugs = [...filteredBugs].sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]

    if (sortBy === 'createdAt') {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }

    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Bug List</h2>
      <ul className="space-y-4">
        {sortedBugs.map(bug => (
          <li key={bug._id} className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold">{bug.title}</h3>
            <p className="text-gray-700">{bug.description}</p>
            <p className="text-sm text-gray-500">Status: {bug.status}</p>
            <p className="text-sm text-gray-500">Priority: {bug.priority}</p>
            <p className="text-sm text-gray-500">
              Created: {bug.createdAt ? new Date(bug.createdAt).toLocaleString() : 'Unknown'}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default BugList
