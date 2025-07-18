/**
 * Validation utility functions
 * Contains reusable validation logic for the application
 */

/**
 * Validate bug severity
 * @param {string} severity - The severity level to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidSeverity = (severity) => {
  const validSeverities = ['low', 'medium', 'high', 'critical'];
  return validSeverities.includes(severity.toLowerCase());
};

/**
 * Validate bug status
 * @param {string} status - The status to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidStatus = (status) => {
  const validStatuses = ['open', 'in-progress', 'resolved', 'closed'];
  return validStatuses.includes(status.toLowerCase());
};

/**
 * Sanitize string input
 * @param {string} input - The input string to sanitize
 * @returns {string} - Sanitized string
 */
const sanitizeString = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().replace(/[<>]/g, '');
};

/**
 * Validate email format
 * @param {string} email - The email to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate MongoDB ObjectId
 * @param {string} id - The ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
const isValidObjectId = (id) => {
  const objectIdRegex = /^[0-9a-fA-F]{24}$/;
  return objectIdRegex.test(id);
};

module.exports = {
  isValidSeverity,
  isValidStatus,
  sanitizeString,
  isValidEmail,
  isValidObjectId
};