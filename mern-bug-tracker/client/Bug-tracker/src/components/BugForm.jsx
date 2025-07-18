/**
 * BugForm component
 * Form for creating and editing bugs
 */

import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useBugContext } from '../context/BugContext'
import { Save, X, Plus, Minus } from 'lucide-react'
import LoadingSpinner from './LoadingSpinner'

const BugForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()
  const { createBug, updateBug, getBugById, loading } = useBugContext()
  const isEditing = Boolean(id)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    severity: 'medium',
    status: 'open',
    reportedBy: '',
    assignedTo: '',
    tags: [],
    reproductionSteps: ''
  })

  const [tagInput, setTagInput] = useState('')
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  console.log('📝 BugForm component rendered', { 
    isEditing, 
    bugId: id, 
    loading,
    formData: { ...formData, description: formData.description.substring(0, 50) + '...' }
  })

  useEffect(() => {
    if (isEditing && id) {
      console.log('📥 Loading bug data for editing:', id)
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        status: 'open',
        reportedBy: '',
        assignedTo: '',
        tags: [],
        reproductionSteps: ''
      })
      const loadBug = async () => {
        try {
          const bug = await getBugById(id)
          console.log('✅ Bug data loaded:', bug)
          setFormData({
            title: bug.title || '',
            description: bug.description || '',
            severity: bug.severity || 'medium',
            status: bug.status || 'open',
            reportedBy: bug.reportedBy || '',
            assignedTo: bug.assignedTo || '',
            tags: bug.tags || [],
            reproductionSteps: bug.reproductionSteps || ''
          })
        } catch (error) {
          console.error('❌ Error loading bug:', error)
          setErrors({ general: 'Failed to load bug data. Please try again.' })
          navigate('/')
        }
      }
      loadBug()
    } else {
      // Reset form for new bug creation
      setFormData({
        title: '',
        description: '',
        severity: 'medium',
        status: 'open',
        reportedBy: '',
        assignedTo: '',
        tags: [],
        reproductionSteps: ''
      })
    }
  }, [isEditing, id, getBugById, navigate])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    console.log('📝 Form input changed:', { name, value })
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleAddTag = () => {
    const trimmedTag = tagInput.trim()
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      console.log('🏷️ Adding tag:', trimmedTag)
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, trimmedTag]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tagToRemove) => {
    console.log('🗑️ Removing tag:', tagToRemove)
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }))
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required'
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters'
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters'
    }
    
    if (!formData.reportedBy.trim()) {
      newErrors.reportedBy = 'Reporter name is required'
    }
    
    console.log('✅ Form validation completed:', { hasErrors: Object.keys(newErrors).length > 0, errors: newErrors })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('📤 Form submission started')
    
    if (!validateForm()) {
      console.log('❌ Form validation failed')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      if (isEditing) {
        console.log('📝 Updating bug:', id)
        await updateBug(id, formData)
        console.log('✅ Bug updated successfully')
      } else {
        console.log('📝 Creating new bug')
        await createBug(formData)
        console.log('✅ Bug created successfully')
      }
      
      navigate('/')
    } catch (error) {
      console.error('❌ Error submitting form:', error)
      // Error handling is managed by the context
    } finally {
      setIsSubmitting(false)
    }
  }

  if (loading && isEditing) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-900">
          {isEditing ? 'Edit Bug Report' : 'Report New Bug'}
        </h2>
        <p className="text-gray-600 mt-2">
          {isEditing ? 'Update the bug report details' : 'Fill out the form to report a new bug'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-6">
        {/* General Error Message */}
        {errors.general && (
          <div className="bg-error-50 border border-error-200 rounded-lg p-4">
            <p className="text-error-700">{errors.general}</p>
          </div>
        )}

        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Bug Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className={`input ${errors.title ? 'border-error-500 focus:ring-error-500' : ''}`}
            placeholder="Brief description of the bug"
            maxLength={100}
          />
          {errors.title && <p className="mt-1 text-sm text-error-600">{errors.title}</p>}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows={4}
            className={`input ${errors.description ? 'border-error-500 focus:ring-error-500' : ''}`}
            placeholder="Detailed description of the bug"
            maxLength={1000}
          />
          {errors.description && <p className="mt-1 text-sm text-error-600">{errors.description}</p>}
          <p className="mt-1 text-sm text-gray-500">
            {formData.description.length}/1000 characters
          </p>
        </div>

        {/* Severity and Status */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="severity" className="block text-sm font-medium text-gray-700 mb-2">
              Severity
            </label>
            <select
              id="severity"
              name="severity"
              value={formData.severity}
              onChange={handleInputChange}
              className="input"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="input"
            >
              <option value="open">Open</option>
              <option value="in-progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>
        </div>

        {/* Reporter and Assignee */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="reportedBy" className="block text-sm font-medium text-gray-700 mb-2">
              Reported By *
            </label>
            <input
              type="text"
              id="reportedBy"
              name="reportedBy"
              value={formData.reportedBy}
              onChange={handleInputChange}
              className={`input ${errors.reportedBy ? 'border-error-500 focus:ring-error-500' : ''}`}
              placeholder="Your name"
              maxLength={50}
            />
            {errors.reportedBy && <p className="mt-1 text-sm text-error-600">{errors.reportedBy}</p>}
          </div>

          <div>
            <label htmlFor="assignedTo" className="block text-sm font-medium text-gray-700 mb-2">
              Assigned To
            </label>
            <input
              type="text"
              id="assignedTo"
              name="assignedTo"
              value={formData.assignedTo}
              onChange={handleInputChange}
              className="input"
              placeholder="Assignee name (optional)"
              maxLength={50}
            />
          </div>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags
          </label>
          <div className="flex space-x-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              className="input flex-1"
              placeholder="Add a tag"
              maxLength={20}
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="btn-secondary"
              disabled={!tagInput.trim()}
            >
              <Plus className="h-5 w-5" />
            </button>
          </div>
          {formData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center space-x-1 px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-primary-600 hover:text-primary-800"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Reproduction Steps */}
        <div>
          <label htmlFor="reproductionSteps" className="block text-sm font-medium text-gray-700 mb-2">
            Reproduction Steps
          </label>
          <textarea
            id="reproductionSteps"
            name="reproductionSteps"
            value={formData.reproductionSteps}
            onChange={handleInputChange}
            rows={3}
            className="input"
            placeholder="Step by step instructions to reproduce the bug"
            maxLength={500}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.reproductionSteps.length}/500 characters
          </p>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center space-x-2"
          >
            <X className="h-5 w-5" />
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary flex items-center space-x-2"
          >
            {isSubmitting ? (
              <LoadingSpinner className="h-5 w-5" />
            ) : (
              <Save className="h-5 w-5" />
            )}
            <span>{isSubmitting ? 'Saving...' : (isEditing ? 'Update Bug' : 'Create Bug')}</span>
          </button>
        </div>
      </form>
    </div>
  )
}

export default BugForm