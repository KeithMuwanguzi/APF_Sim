/**
 * Test to verify fast-check is properly installed and configured
 * Feature: membership-registration-payment
 * Task: 6.1 - Verify fast-check property-based testing library
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';

describe('Fast-Check Setup', () => {
  it('should run a simple property-based test', () => {
    // Property: reversing a string twice should give the original string
    fc.assert(
      fc.property(fc.string(), (str) => {
        const reversed = str.split('').reverse().join('');
        const doubleReversed = reversed.split('').reverse().join('');
        return doubleReversed === str;
      })
    );
  });

  it('should generate phone numbers in Uganda format', () => {
    // Property: Uganda phone number format (256XXXXXXXXX)
    const phoneArbitrary = fc.integer({ min: 700000000, max: 799999999 })
      .map(num => `256${num}`);

    fc.assert(
      fc.property(phoneArbitrary, (phone) => {
        return phone.startsWith('256') && phone.length === 12;
      }),
      { numRuns: 100 }
    );
  });

  it('should generate integers within range', () => {
    // Property: generated integers should be within specified range
    fc.assert(
      fc.property(
        fc.integer({ min: 18, max: 100 }),
        (age) => {
          return age >= 18 && age <= 100;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should verify fast-check can generate dates', () => {
    // Property: date of birth should be in the past
    const today = new Date();
    
    fc.assert(
      fc.property(
        fc.date({ max: today }),
        (dob) => {
          return dob <= today;
        }
      ),
      { numRuns: 100 }
    );
  });

  it('should verify fast-check is available for property-based testing', () => {
    // Simple verification that fast-check module is loaded
    expect(fc).toBeDefined();
    expect(fc.assert).toBeDefined();
    expect(fc.property).toBeDefined();
    expect(fc.string).toBeDefined();
    expect(fc.integer).toBeDefined();
  });
});
