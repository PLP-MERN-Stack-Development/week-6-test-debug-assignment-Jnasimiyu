// client/src/services/bugService.js
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000/api/bugs'

const getAllBugs = async (filters = {}) => {
  const res = await axios.get(API_BASE_URL, { params: filters })
  console.log('✅ API Response:', res.data)

  // Return the array of bugs directly
  return res.data.bugs || []  // <-- This is critical!
}

const getBugById = async (id) => {
  const res = await axios.get(`${API_BASE_URL}/${id}`)
  return res.data
}

const createBug = async (bugData) => {
  const res = await axios.post(API_BASE_URL, bugData)
  return res.data
}

const updateBug = async (id, bugData) => {
  const res = await axios.put(`${API_BASE_URL}/${id}`, bugData)
  return res.data
}

const deleteBug = async (id) => {
  const res = await axios.delete(`${API_BASE_URL}/${id}`)
  return res.data
}

// Optional health check
const healthCheck = async () => {
  return axios.get('http://localhost:5000/api/bugs/health') // Optional route
}

export default {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  healthCheck,
}
