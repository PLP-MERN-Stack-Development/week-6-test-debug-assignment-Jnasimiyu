/**
 * Bug routes
 * Defines API endpoints for bug operations with validation
 */

const express = require('express');
const { body } = require('express-validator');
const {
  getAllBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug
} = require('../controllers/bugController');

const router = express.Router();

// Validation rules for creating and updating a bug
const bugValidationRules = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),

  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),

  body('severity')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Severity must be one of: low, medium, high, critical'),

  body('status')
    .optional()
    .isIn(['open', 'in-progress', 'resolved', 'closed'])
    .withMessage('Status must be one of: open, in-progress, resolved, closed'),

  body('reportedBy')
    .trim()
    .isLength({ min: 1, max: 50 })
    .withMessage('Reporter name must be between 1 and 50 characters'),

  body('assignedTo')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Assignee name cannot exceed 50 characters'),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('tags.*')
    .optional()
    .trim()
    .isLength({ max: 20 })
    .withMessage('Each tag cannot exceed 20 characters'),

  body('reproductionSteps')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Reproduction steps cannot exceed 500 characters')
];

// Routes
router
  .route('/')
  .get(getAllBugs)
  .post(bugValidationRules, createBug);

router
  .route('/:id')
  .get(getBugById)
  .put(bugValidationRules, updateBug)
  .delete(deleteBug);

module.exports = router;
