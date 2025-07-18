import React, { createContext, useContext, useReducer } from 'react'
import bugService from '../services/bugService'

export const BugContext = createContext()


const bugReducer = (state, action) => {
  console.log('🔄 Bug reducer:', action.type, action.payload)
  
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload, loading: false }
    case 'SET_BUGS':
      return { ...state, bugs: action.payload, loading: false, error: null }
    case 'ADD_BUG':
      return { ...state, bugs: [action.payload, ...state.bugs], loading: false }
    case 'UPDATE_BUG':
      return {
        ...state,
        bugs: state.bugs.map(bug =>
          bug._id === action.payload._id ? action.payload : bug
        ),
        loading: false
      }
    case 'DELETE_BUG':
      return {
        ...state,
        bugs: state.bugs.filter(bug => bug._id !== action.payload),
        loading: false
      }
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    case 'SET_SORT_BY':
      return { ...state, sortBy: action.payload }
    case 'SET_SORT_ORDER':
      return { ...state, sortOrder: action.payload }
    default:
      return state
  }
}

export const BugProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bugReducer, {
    bugs: [],
    loading: false,
    error: null,
    filter: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  })

  const fetchBugs = async (filters = {}) => {
    try {
      console.log('📥 Fetching bugs with filters:', filters)
      dispatch({ type: 'SET_LOADING', payload: true })

      // Health check
      try {
        await bugService.healthCheck()
        console.log('✅ Backend health check passed')
      } catch (healthError) {
        console.error('❌ Backend health check failed:', healthError)
        throw new Error('Backend server is not accessible. Please ensure it\'s running on port 5000.')
      }

      const bugs = await bugService.getAllBugs(filters)
      console.log('✅ Bugs fetched successfully:', bugs?.length || 0)
      dispatch({ type: 'SET_BUGS', payload: bugs || [] })
    } catch (error) {
      console.error('❌ Error fetching bugs:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      dispatch({ type: 'SET_BUGS', payload: [] })
    }
  }

  const getBugById = async (id) => {
    try {
      console.log('📥 Fetching bug by ID:', id)
      const bug = await bugService.getBugById(id)
      console.log('✅ Bug fetched successfully:', bug)
      return bug
    } catch (error) {
      console.error('❌ Error fetching bug:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const createBug = async (bugData) => {
    try {
      console.log('📝 Creating new bug:', bugData)
      dispatch({ type: 'SET_LOADING', payload: true })
      const newBug = await bugService.createBug(bugData)
      console.log('✅ Bug created successfully:', newBug)
      dispatch({ type: 'ADD_BUG', payload: newBug })
      return newBug
    } catch (error) {
      console.error('❌ Error creating bug:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const updateBug = async (id, bugData) => {
    try {
      console.log('📝 Updating bug:', id, bugData)
      dispatch({ type: 'SET_LOADING', payload: true })
      const updatedBug = await bugService.updateBug(id, bugData)
      console.log('✅ Bug updated successfully:', updatedBug)
      dispatch({ type: 'UPDATE_BUG', payload: updatedBug })
      return updatedBug
    } catch (error) {
      console.error('❌ Error updating bug:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  const deleteBug = async (id) => {
    try {
      console.log('🗑️ Deleting bug:', id)
      dispatch({ type: 'SET_LOADING', payload: true })
      await bugService.deleteBug(id)
      console.log('✅ Bug deleted successfully')
      dispatch({ type: 'DELETE_BUG', payload: id })
    } catch (error) {
      console.error('❌ Error deleting bug:', error)
      dispatch({ type: 'SET_ERROR', payload: error.message })
      throw error
    }
  }

  // Extra: filter/sort setters
  const setFilter = (filter) => dispatch({ type: 'SET_FILTER', payload: filter })
  const setSortBy = (sortBy) => dispatch({ type: 'SET_SORT_BY', payload: sortBy })
  const setSortOrder = (sortOrder) => dispatch({ type: 'SET_SORT_ORDER', payload: sortOrder })

  const value = {
    bugs: state.bugs,
    loading: state.loading,
    error: state.error,
    filter: state.filter,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    fetchBugs,
    getBugById,
    createBug,
    updateBug,
    deleteBug,
    setFilter,
    setSortBy,
    setSortOrder
  }

  return <BugContext.Provider value={value}>{children}</BugContext.Provider>
}

export const useBugContext = () => {
  const context = useContext(BugContext)
  if (!context) {
    throw new Error('useBugContext must be used within a BugProvider')
  }
  return context
}
