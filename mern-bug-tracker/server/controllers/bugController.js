/**
 * Bug Controller
 * Handles all bug-related business logic and database operations
 */

const Bug = require('../models/Bug');
const { validationResult } = require('express-validator');

// Utility to handle async/await errors
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

/**
 * @desc    Get all bugs (with optional filtering & sorting)
 * @route   GET /api/bugs
 * @access  Public
 */
const getAllBugs = asyncHandler(async (req, res) => {
  console.log('🔍 Fetching all bugs...');

  const { status, severity, sort = '-createdAt' } = req.query;

  const query = {};
  if (status) query.status = status;
  if (severity) query.severity = severity;

  const bugs = await Bug.find(query).sort(sort);

  console.log(`✅ Found ${bugs.length} bugs`);
  res.status(200).json({
    success: true,
    count: bugs.length,
    data: bugs,
  });
});

/**
 * @desc    Get single bug by ID
 * @route   GET /api/bugs/:id
 * @access  Public
 */
const getBugById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`🔍 Fetching bug with ID: ${id}`);

  const bug = await Bug.findById(id);

  if (!bug) {
    console.log('❌ Bug not found');
    return res.status(404).json({ success: false, message: 'Bug not found' });
  }

  res.status(200).json({ success: true, data: bug });
});

/**
 * @desc    Create a new bug
 * @route   POST /api/bugs
 * @access  Public
 */
const createBug = asyncHandler(async (req, res) => {
  console.log('📝 Creating new bug...');
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  const bug = await Bug.create(req.body);

  console.log('✅ Bug created successfully:', bug._id);
  res.status(201).json({
    success: true,
    message: 'Bug created successfully',
    data: bug,
  });
});

/**
 * @desc    Update a bug by ID
 * @route   PUT /api/bugs/:id
 * @access  Public
 */
const updateBug = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`🛠️ Updating bug with ID: ${id}`);

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('❌ Validation errors:', errors.array());
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array(),
    });
  }

  const updatedBug = await Bug.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!updatedBug) {
    console.log('❌ Bug not found for update');
    return res.status(404).json({ success: false, message: 'Bug not found' });
  }

  console.log('✅ Bug updated successfully');
  res.status(200).json({
    success: true,
    message: 'Bug updated successfully',
    data: updatedBug,
  });
});

/**
 * @desc    Delete a bug by ID
 * @route   DELETE /api/bugs/:id
 * @access  Public
 */
const deleteBug = asyncHandler(async (req, res) => {
  const { id } = req.params;
  console.log(`🗑️ Deleting bug with ID: ${id}`);

  const deletedBug = await Bug.findByIdAndDelete(id);

  if (!deletedBug) {
    console.log('❌ Bug not found for deletion');
    return res.status(404).json({ success: false, message: 'Bug not found' });
  }

  console.log('✅ Bug deleted successfully');
  res.status(200).json({
    success: true,
    message: 'Bug deleted successfully',
  });
});

module.exports = {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
};
