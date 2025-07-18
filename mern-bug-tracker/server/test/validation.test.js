/**
 * Unit tests for validation utilities
 * Tests individual validation functions
 */

const {
  isValidSeverity,
  isValidStatus,
  sanitizeString,
  isValidEmail,
  isValidObjectId
} = require('../utils/validation');

describe('Validation Utils', () => {
  describe('isValidSeverity', () => {
    test('should return true for valid severity levels', () => {
      expect(isValidSeverity('low')).toBe(true);
      expect(isValidSeverity('medium')).toBe(true);
      expect(isValidSeverity('high')).toBe(true);
      expect(isValidSeverity('critical')).toBe(true);
      expect(isValidSeverity('LOW')).toBe(true); // case insensitive
    });

    test('should return false for invalid severity levels', () => {
      expect(isValidSeverity('invalid')).toBe(false);
      expect(isValidSeverity('')).toBe(false);
      expect(isValidSeverity('urgent')).toBe(false);
    });
  });

  describe('isValidStatus', () => {
    test('should return true for valid status values', () => {
      expect(isValidStatus('open')).toBe(true);
      expect(isValidStatus('in-progress')).toBe(true);
      expect(isValidStatus('resolved')).toBe(true);
      expect(isValidStatus('closed')).toBe(true);
      expect(isValidStatus('OPEN')).toBe(true); // case insensitive
    });

    test('should return false for invalid status values', () => {
      expect(isValidStatus('invalid')).toBe(false);
      expect(isValidStatus('')).toBe(false);
      expect(isValidStatus('pending')).toBe(false);
    });
  });

  describe('sanitizeString', () => {
    test('should remove HTML tags and trim whitespace', () => {
      expect(sanitizeString('  hello world  ')).toBe('hello world');
      expect(sanitizeString('<script>alert("xss")</script>')).toBe('scriptalert("xss")/script');
      expect(sanitizeString('normal text')).toBe('normal text');
    });

    test('should handle non-string input', () => {
      expect(sanitizeString(null)).toBe('');
      expect(sanitizeString(undefined)).toBe('');
      expect(sanitizeString(123)).toBe('');
    });
  });

  describe('isValidEmail', () => {
    test('should return true for valid email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    test('should return false for invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('')).toBe(false);
    });
  });

  describe('isValidObjectId', () => {
    test('should return true for valid MongoDB ObjectId', () => {
      expect(isValidObjectId('507f1f77bcf86cd799439011')).toBe(true);
      expect(isValidObjectId('123456789012345678901234')).toBe(true);
    });

    test('should return false for invalid ObjectId', () => {
      expect(isValidObjectId('invalid')).toBe(false);
      expect(isValidObjectId('507f1f77bcf86cd79943901')).toBe(false); // too short
      expect(isValidObjectId('507f1f77bcf86cd7994390111')).toBe(false); // too long
      expect(isValidObjectId('')).toBe(false);
    });
  });
});