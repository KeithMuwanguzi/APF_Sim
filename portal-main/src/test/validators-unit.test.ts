/**
 * Unit tests for field validation utilities
 * Feature: membership-registration-payment
 */

import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePasswordLength,
  validatePasswordMatch,
  validatePhoneNumber,
  validateAge,
  validateFileSize,
  validateFileFormat,
  validateFile,
} from '../utils/validators';

describe('Field Validators - Unit Tests', () => {
  describe('validateEmail', () => {
    it('should accept valid email addresses', () => {
      expect(validateEmail('user@example.com').isValid).toBe(true);
      expect(validateEmail('test.user@domain.co.uk').isValid).toBe(true);
      expect(validateEmail('name+tag@company.org').isValid).toBe(true);
    });

    it('should reject invalid email addresses', () => {
      expect(validateEmail('').isValid).toBe(false);
      expect(validateEmail('notanemail').isValid).toBe(false);
      expect(validateEmail('@example.com').isValid).toBe(false);
      expect(validateEmail('user@').isValid).toBe(false);
      expect(validateEmail('user @example.com').isValid).toBe(false);
    });
  });

  describe('validatePasswordLength', () => {
    it('should accept passwords with 8 or more characters', () => {
      expect(validatePasswordLength('12345678').isValid).toBe(true);
      expect(validatePasswordLength('verylongpassword').isValid).toBe(true);
    });

    it('should reject passwords with less than 8 characters', () => {
      expect(validatePasswordLength('').isValid).toBe(false);
      expect(validatePasswordLength('1234567').isValid).toBe(false);
      expect(validatePasswordLength('short').isValid).toBe(false);
    });
  });

  describe('validatePasswordMatch', () => {
    it('should accept matching passwords', () => {
      expect(validatePasswordMatch('password123', 'password123').isValid).toBe(true);
    });

    it('should reject non-matching passwords', () => {
      expect(validatePasswordMatch('password123', 'password456').isValid).toBe(false);
      expect(validatePasswordMatch('test', 'Test').isValid).toBe(false);
    });
  });

  describe('validatePhoneNumber', () => {
    it('should accept valid phone numbers in format 256XXXXXXXXX', () => {
      expect(validatePhoneNumber('256701234567').isValid).toBe(true);
      expect(validatePhoneNumber('256752345678').isValid).toBe(true);
    });

    it('should reject invalid phone numbers', () => {
      expect(validatePhoneNumber('').isValid).toBe(false);
      expect(validatePhoneNumber('256').isValid).toBe(false);
      expect(validatePhoneNumber('25612345').isValid).toBe(false);
      expect(validatePhoneNumber('256abc123456').isValid).toBe(false);
      expect(validatePhoneNumber('123456789012').isValid).toBe(false);
    });
  });

  describe('validateAge', () => {
    it('should accept dates of birth for users 18 or older', () => {
      const twentyYearsAgo = new Date();
      twentyYearsAgo.setFullYear(twentyYearsAgo.getFullYear() - 20);
      const dob = twentyYearsAgo.toISOString().split('T')[0];
      
      expect(validateAge(dob).isValid).toBe(true);
    });

    it('should reject dates of birth for users under 18', () => {
      const tenYearsAgo = new Date();
      tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
      const dob = tenYearsAgo.toISOString().split('T')[0];
      
      expect(validateAge(dob).isValid).toBe(false);
    });

    it('should reject empty or invalid dates', () => {
      expect(validateAge('').isValid).toBe(false);
      expect(validateAge('invalid-date').isValid).toBe(false);
    });
  });

  describe('validateFileSize', () => {
    it('should accept files under 5MB', () => {
      const smallFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(smallFile, 'size', { value: 1024 * 1024 }); // 1MB
      
      expect(validateFileSize(smallFile).isValid).toBe(true);
    });

    it('should reject files over 5MB', () => {
      const largeFile = new File(['content'], 'test.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 6 * 1024 * 1024 }); // 6MB
      
      expect(validateFileSize(largeFile).isValid).toBe(false);
    });
  });

  describe('validateFileFormat', () => {
    it('should accept supported file formats', () => {
      expect(validateFileFormat(new File([''], 'doc.pdf')).isValid).toBe(true);
      expect(validateFileFormat(new File([''], 'image.jpg')).isValid).toBe(true);
      expect(validateFileFormat(new File([''], 'photo.jpeg')).isValid).toBe(true);
      expect(validateFileFormat(new File([''], 'pic.png')).isValid).toBe(true);
      expect(validateFileFormat(new File([''], 'DOC.PDF')).isValid).toBe(true); // Case insensitive
    });

    it('should reject unsupported file formats', () => {
      expect(validateFileFormat(new File([''], 'doc.txt')).isValid).toBe(false);
      expect(validateFileFormat(new File([''], 'doc.docx')).isValid).toBe(false);
      expect(validateFileFormat(new File([''], 'file.exe')).isValid).toBe(false);
      expect(validateFileFormat(new File([''], 'noextension')).isValid).toBe(false);
    });
  });

  describe('validateFile', () => {
    it('should accept valid files (correct size and format)', () => {
      const validFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      Object.defineProperty(validFile, 'size', { value: 1024 * 1024 }); // 1MB
      
      expect(validateFile(validFile).isValid).toBe(true);
    });

    it('should reject files with invalid size', () => {
      const largeFile = new File(['content'], 'document.pdf', { type: 'application/pdf' });
      Object.defineProperty(largeFile, 'size', { value: 10 * 1024 * 1024 }); // 10MB
      
      const result = validateFile(largeFile);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('5MB');
    });

    it('should reject files with invalid format', () => {
      const invalidFile = new File(['content'], 'document.txt', { type: 'text/plain' });
      Object.defineProperty(invalidFile, 'size', { value: 1024 }); // 1KB
      
      const result = validateFile(invalidFile);
      expect(result.isValid).toBe(false);
      expect(result.errorMessage).toContain('PDF, JPG, JPEG, and PNG');
    });
  });
});
