/**
 * Unit tests for SuccessModal component
 * Feature: membership-registration-payment
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import SuccessModal from '../components/register-components/SuccessModal';

describe('SuccessModal - Unit Tests', () => {
  /**
   * Unit Test: Modal displays correct message
   * Validates: Requirements 9.4
   */
  it('should display the correct success message', () => {
    const message = 'Your application has been submitted successfully! Please await a confirmation email from the admin.';
    const onCloseMock = vi.fn();

    render(
      <SuccessModal
        isOpen={true}
        onClose={onCloseMock}
        message={message}
      />
    );

    expect(screen.getByText(message)).toBeInTheDocument();
    expect(screen.getByText('Success!')).toBeInTheDocument();
  });

  /**
   * Unit Test: Modal can be closed with close button
   * Validates: Requirements 9.4
   */
  it('should call onClose when close button is clicked', () => {
    const message = 'Test message';
    const onCloseMock = vi.fn();

    render(
      <SuccessModal
        isOpen={true}
        onClose={onCloseMock}
        message={message}
      />
    );

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  /**
   * Unit Test: Modal can be closed by clicking backdrop
   * Validates: Requirements 9.4
   */
  it('should call onClose when backdrop is clicked', () => {
    const message = 'Test message';
    const onCloseMock = vi.fn();

    render(
      <SuccessModal
        isOpen={true}
        onClose={onCloseMock}
        message={message}
      />
    );

    const backdrop = screen.getByRole('dialog');
    fireEvent.click(backdrop);

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  /**
   * Unit Test: Modal does not close when clicking modal content
   * Validates: Requirements 9.4
   */
  it('should not call onClose when clicking modal content', () => {
    const message = 'Test message';
    const onCloseMock = vi.fn();

    render(
      <SuccessModal
        isOpen={true}
        onClose={onCloseMock}
        message={message}
      />
    );

    const modalContent = screen.getByText('Success!').closest('div');
    if (modalContent) {
      fireEvent.click(modalContent);
    }

    expect(onCloseMock).not.toHaveBeenCalled();
  });

  /**
   * Unit Test: Modal can be closed with Escape key
   * Validates: Requirements 9.4
   */
  it('should call onClose when Escape key is pressed', () => {
    const message = 'Test message';
    const onCloseMock = vi.fn();

    render(
      <SuccessModal
        isOpen={true}
        onClose={onCloseMock}
        message={message}
      />
    );

    fireEvent.keyDown(document, { key: 'Escape' });

    expect(onCloseMock).toHaveBeenCalledTimes(1);
  });

  /**
   * Unit Test: Modal does not render when isOpen is false
   * Validates: Requirements 9.4
   */
  it('should not render when isOpen is false', () => {
    const message = 'Test message';
    const onCloseMock = vi.fn();

    const { container } = render(
      <SuccessModal
        isOpen={false}
        onClose={onCloseMock}
        message={message}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  /**
   * Unit Test: Modal has proper accessibility attributes
   * Validates: Requirements 9.4
   */
  it('should have proper accessibility attributes', () => {
    const message = 'Test message';
    const onCloseMock = vi.fn();

    render(
      <SuccessModal
        isOpen={true}
        onClose={onCloseMock}
        message={message}
      />
    );

    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby', 'success-modal-title');
  });

  /**
   * Unit Test: Modal displays success icon
   * Validates: Requirements 9.4
   */
  it('should display success icon', () => {
    const message = 'Test message';
    const onCloseMock = vi.fn();

    render(
      <SuccessModal
        isOpen={true}
        onClose={onCloseMock}
        message={message}
      />
    );

    // Check for the SVG checkmark icon
    const icon = screen.getByRole('dialog').querySelector('svg');
    expect(icon).toBeInTheDocument();
  });
});
