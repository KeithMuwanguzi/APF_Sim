/**
 * Responsive Design Unit Tests
 * Feature: membership-registration-payment
 * 
 * Tests for responsive design and mobile optimization.
 * Requirements: 12.1, 12.3, 12.4
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import ApplyForm from '../components/register-components/Applyform';
import SuccessModal from '../components/register-components/SuccessModal';

describe('Feature: membership-registration-payment - Responsive Design', () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  /**
   * Test: Mobile layout at various viewport sizes
   * Validates: Requirement 12.1
   */
  it('should render mobile layout at viewport < 768px', () => {
    // Set viewport to mobile size
    global.innerWidth = 375;
    global.innerHeight = 667;

    render(<ApplyForm />);

    // Check that mobile step indicator is present
    expect(screen.getByText(/Step 1 of 4/i)).toBeInTheDocument();
    
    // Check that form renders
    expect(screen.getByRole('heading', { name: /Account Details/i })).toBeInTheDocument();
  });

  /**
   * Test: Desktop layout at larger viewport
   * Validates: Requirement 12.1
   */
  it('should render desktop layout at viewport >= 768px', () => {
    // Set viewport to desktop size
    global.innerWidth = 1024;
    global.innerHeight = 768;

    render(<ApplyForm />);

    // Check that form renders
    expect(screen.getByRole('heading', { name: /Account Details/i })).toBeInTheDocument();
  });

  /**
   * Test: Touch target sizes for buttons
   * Validates: Requirement 12.3, 12.4
   */
  it('should have appropriately sized touch targets for buttons', () => {
    render(<ApplyForm />);

    // Get Next and Back buttons
    const nextButton = screen.getByRole('button', { name: /next/i });
    const backButton = screen.getByRole('button', { name: /back/i });

    // Check that buttons have minimum height class (min-h-[44px])
    expect(nextButton.className).toContain('min-h-[44px]');
    expect(backButton.className).toContain('min-h-[44px]');
    
    // Check that buttons have touch-manipulation class for better touch response
    expect(nextButton.className).toContain('min-w-[44px]');
    expect(backButton.className).toContain('min-w-[44px]');
  });

  /**
   * Test: Modal responsive design
   * Validates: Requirement 12.1
   */
  it('should render modal responsively', () => {
    const mockClose = () => {};
    
    render(
      <SuccessModal
        isOpen={true}
        onClose={mockClose}
        message="Test message"
      />
    );

    // Check that modal renders
    expect(screen.getByText(/Success!/i)).toBeInTheDocument();
    expect(screen.getByText(/Test message/i)).toBeInTheDocument();
    
    // Check that close button has proper touch target
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton.className).toContain('min-h-[44px]');
  });

  /**
   * Test: Form inputs have proper padding for touch
   * Validates: Requirement 12.3, 12.4
   */
  it('should have properly sized input fields for touch interaction', () => {
    render(<ApplyForm />);

    // Get input fields
    const usernameInput = screen.getByPlaceholderText(/johndoe/i);
    const emailInput = screen.getByPlaceholderText(/john@example.com/i);

    // Check that inputs have touch-manipulation class
    expect(usernameInput.className).toContain('touch-manipulation');
    expect(emailInput.className).toContain('touch-manipulation');
  });

  /**
   * Test: Responsive padding and spacing
   * Validates: Requirement 12.1
   */
  it('should have responsive padding on form container', () => {
    render(<ApplyForm />);

    // Check that the main section has responsive padding
    const section = document.querySelector('section');
    expect(section?.className).toContain('py-6');
    expect(section?.className).toContain('sm:py-10');
    expect(section?.className).toContain('px-4');
  });

  /**
   * Test: Buttons have responsive padding
   * Validates: Requirement 12.3
   */
  it('should have responsive button padding', () => {
    render(<ApplyForm />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    
    // Check for responsive padding classes
    expect(nextButton.className).toContain('px-6');
    expect(nextButton.className).toContain('sm:px-8');
    expect(nextButton.className).toContain('py-3');
    expect(nextButton.className).toContain('sm:py-2');
  });

  /**
   * Test: Text remains readable without horizontal scrolling
   * Validates: Requirement 12.2
   */
  it('should not cause horizontal scrolling on mobile', () => {
    // Set viewport to small mobile size
    global.innerWidth = 320;
    global.innerHeight = 568;

    render(<ApplyForm />);

    // Check that container has proper width constraints
    const container = document.querySelector('.max-w-6xl');
    expect(container).toBeInTheDocument();
    
    // Check that form card has full width on mobile
    const formCard = document.querySelector('.max-w-4xl');
    expect(formCard?.className).toContain('w-full');
  });
});
