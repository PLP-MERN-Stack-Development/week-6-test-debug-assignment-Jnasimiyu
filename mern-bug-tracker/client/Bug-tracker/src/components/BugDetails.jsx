/**
 * BugDetails component
 * Displays detailed view of a single bug
 */

import React, { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useBugContext } from '../context/BugContext'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  XCircle,
  Tag
} from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

const BugDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getBugById, deleteBug, loading } = useBugContext()
  const [bug, setBug] = useState(null)
  const [error, setError] = useState(null)

  console.log('🔍 BugDetails component rendered', { bugId: id, loading })

  useEffect(() => {
    const loadBug = async () => {
      try {
        console.log('📥 Loading bug details:', id)
        const bugData = await getBugById(id)
        console.log('✅ Bug details loaded:', bugData)
        setBug(bugData)
      } catch (error) {
        console.error('❌ Error loading bug details:', error)
        setError(error.message || 'Failed to load bug details')
      }
    }

    if (id) {
      loadBug()
    }
  }, [id, getBugById])

  const handleDelete = async () => {
    if (window.confirm(`Are you sure you want to delete "${bug.title}"?`)) {
      try {
        console.log('🗑️ Deleting bug:', id)
        await deleteBug(id)
        console.log('✅ Bug deleted successfully')
        navigate('/')
      } catch (error) {
        console.error('❌ Error deleting bug:', error)
      }
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'open':
        return <AlertCircle className="h-6 w-6 text-error-500" />
      case 'in-progress':
        return <Clock className="h-6 w-6 text-warning-500" />
      case 'resolved':
        return <CheckCircle className="h-6 w-6 text-success-500" />
      case 'closed':
        return <XCircle className="h-6 w-6 text-gray-500" />
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-error-50 border border-error-200 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <AlertCircle className="h-6 w-6 text-error-500 mr-2" />
            <h3 className="text-lg font-semibold text-error-900">Error Loading Bug</h3>
          </div>
          <p className="text-error-700 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Bug List
          </button>
        </div>
      </div>
    )
  }

  if (!bug) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Bug Not Found</h3>
          <p className="text-gray-600 mb-4">The bug you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Bug List
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate('/')}
          className="btn-secondary flex items-center space-x-2"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>Back to Bugs</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <Link
            to={`/edit/${bug._id}`}
            className="btn-primary flex items-center space-x-2"
            title="Edit this bug report"
          >
            <Edit className="h-5 w-5" />
            <span>Edit</span>
          </Link>
          <button
            onClick={handleDelete}
            className="btn-error flex items-center space-x-2"
            title="Delete this bug report"
          >
            <Trash2 className="h-5 w-5" />
            <span>Delete</span>
          </button>
        </div>
      </div>

      {/* Bug Details */}
      <div className="space-y-6">
        {/* Title and Status */}
        <div className="card p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center space-x-3">
              {getStatusIcon(bug.status)}
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{bug.title}</h1>
                <p className="text-gray-600 capitalize">{bug.status.replace('-', ' ')}</p>
              </div>
            </div>
            <div className={`px-3 py-1 rounded-full text-sm font-medium border ${getSeverityColor(bug.severity)}`}>
              {bug.severity} severity
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="card p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Description</h2>
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{bug.description}</p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Reporter and Assignee */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">People</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Reported by</p>
                  <p className="font-medium text-gray-900">{bug.reportedBy}</p>
                </div>
              </div>
              {bug.assignedTo && (
                <div className="flex items-center space-x-3">
                  <User className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-500">Assigned to</p>
                    <p className="font-medium text-gray-900">{bug.assignedTo}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Timeline</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium text-gray-900">
                    {new Date(bug.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Calendar className="h-5 w-5 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-500">Last updated</p>
                  <p className="font-medium text-gray-900">
                    {new Date(bug.updatedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tags */}
        {bug.tags && bug.tags.length > 0 && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Tag className="h-5 w-5" />
              <span>Tags</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {bug.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Reproduction Steps */}
        {bug.reproductionSteps && (
          <div className="card p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Reproduction Steps</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {bug.reproductionSteps}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default BugDetails