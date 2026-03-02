/**
 * Unit tests for UploadCard component
 * Feature: membership-registration-payment
 * Requirements: 4.2, 4.3, 4.4
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CloudUpload from '../components/register-components/steps/UploadCard';

describe('Feature: membership-registration-payment - UploadCard Component', () => {
  /**
   * Test accepted file formats
   * Requirements: 4.3
   */
  it('should accept PDF, JPG, JPEG, and PNG file formats', () => {
    const onFileSelected = vi.fn();
    
    const { container } = render(
      <CloudUpload
        title="Upload Document"
        description="Max file size 5MB · JPG / PNG / PDF"
        accept=".jpg,.jpeg,.png,.pdf"
        maxSizeMB={5}
        onFileSelected={onFileSelected}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Check that the accept attribute includes all required formats
    expect(input).toBeTruthy();
    expect(input.accept).toBe('.jpg,.jpeg,.png,.pdf');
  });

  /**
   * Test file size limit validation
   * Requirements: 4.2
   */
  it('should reject files larger than the specified size limit', () => {
    const onFileSelected = vi.fn();
    
    const { container } = render(
      <CloudUpload
        title="Upload Document"
        description="Max file size 5MB · JPG / PNG / PDF"
        accept=".jpg,.jpeg,.png,.pdf"
        maxSizeMB={5}
        onFileSelected={onFileSelected}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Create a file larger than 5MB
    const largeFile = new File(['x'.repeat(6 * 1024 * 1024)], 'large.pdf', {
      type: 'application/pdf',
    });
    
    // Override the size property
    Object.defineProperty(largeFile, 'size', {
      value: 6 * 1024 * 1024,
      writable: false,
    });

    // Simulate file selection
    fireEvent.change(input, { target: { files: [largeFile] } });

    // Should display error message
    expect(screen.getByText('File must be less than 5MB')).toBeInTheDocument();
    
    // Should not call onFileSelected callback
    expect(onFileSelected).not.toHaveBeenCalled();
  });

  /**
   * Test file size limit validation with valid file
   * Requirements: 4.2
   */
  it('should accept files within the size limit', () => {
    const onFileSelected = vi.fn();
    
    const { container } = render(
      <CloudUpload
        title="Upload Document"
        description="Max file size 5MB · JPG / PNG / PDF"
        accept=".jpg,.jpeg,.png,.pdf"
        maxSizeMB={5}
        onFileSelected={onFileSelected}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Create a file smaller than 5MB
    const validFile = new File(['x'.repeat(1024)], 'valid.pdf', {
      type: 'application/pdf',
    });
    
    // Override the size property
    Object.defineProperty(validFile, 'size', {
      value: 1024,
      writable: false,
    });

    // Simulate file selection
    fireEvent.change(input, { target: { files: [validFile] } });

    // Should call onFileSelected callback
    expect(onFileSelected).toHaveBeenCalledWith(validFile);
    
    // Should display file name
    expect(screen.getByText('valid.pdf')).toBeInTheDocument();
  });

  /**
   * Test file removal functionality
   * Requirements: 4.4
   */
  it('should allow file removal', () => {
    const onFileSelected = vi.fn();
    const onFileRemoved = vi.fn();
    
    const { container } = render(
      <CloudUpload
        title="Upload Document"
        description="Max file size 5MB · JPG / PNG / PDF"
        accept=".jpg,.jpeg,.png,.pdf"
        maxSizeMB={5}
        onFileSelected={onFileSelected}
        onFileRemoved={onFileRemoved}
      />
    );

    const input = container.querySelector('input[type="file"]') as HTMLInputElement;
    
    // Create and upload a valid file
    const validFile = new File(['content'], 'test.pdf', {
      type: 'application/pdf',
    });
    
    Object.defineProperty(validFile, 'size', {
      value: 1024,
      writable: false,
    });

    // Simulate file selection
    fireEvent.change(input, { target: { files: [validFile] } });

    // File should be displayed
    expect(screen.getByText('test.pdf')).toBeInTheDocument();

    // Find and click the remove button
    const removeButton = screen.getByTitle('Remove file');
    fireEvent.click(removeButton);

    // Should call onFileRemoved callback
    expect(onFileRemoved).toHaveBeenCalled();
    
    // File name should no longer be displayed
    expect(screen.queryByText('test.pdf')).not.toBeInTheDocument();
    
    // Should show "Click to upload" message again
    expect(screen.getByText('Click to upload')).toBeInTheDocument();
  });

  /**
   * Test that component displays title and description
   * Requirements: 4.1
   */
  it('should display title and description', () => {
    render(
      <CloudUpload
        title="Upload National ID"
        description="Max file size 5MB · JPG / PNG / PDF"
        accept=".jpg,.jpeg,.png,.pdf"
        maxSizeMB={5}
      />
    );

    expect(screen.getByText('Upload National ID')).toBeInTheDocument();
    expect(screen.getByText('Max file size 5MB · JPG / PNG / PDF')).toBeInTheDocument();
  });

  /**
   * Test that component shows upload prompt when no file is selected
   * Requirements: 4.1
   */
  it('should show upload prompt when no file is selected', () => {
    render(
      <CloudUpload
        title="Upload Document"
        description="Max file size 5MB · JPG / PNG / PDF"
        accept=".jpg,.jpeg,.png,.pdf"
        maxSizeMB={5}
      />
    );

    expect(screen.getByText('Click to upload')).toBeInTheDocument();
  });

  /**
   * Test that component can receive existing file from parent
   * Requirements: 4.1, 13.5
   */
  it('should display existing file when provided', () => {
    const existingFile = new File(['content'], 'existing.pdf', {
      type: 'application/pdf',
    });
    
    render(
      <CloudUpload
        title="Upload Document"
        description="Max file size 5MB · JPG / PNG / PDF"
        accept=".jpg,.jpeg,.png,.pdf"
        maxSizeMB={5}
        existingFile={existingFile}
      />
    );

    // Should display the existing file name
    expect(screen.getByText('existing.pdf')).toBeInTheDocument();
    
    // Should not show "Click to upload" message
    expect(screen.queryByText('Click to upload')).not.toBeInTheDocument();
  });

  /**
   * Test that component can display existing error from parent
   * Requirements: 13.5
   */
  it('should display existing error when provided', () => {
    render(
      <CloudUpload
        title="Upload Document"
        description="Max file size 5MB · JPG / PNG / PDF"
        accept=".jpg,.jpeg,.png,.pdf"
        maxSizeMB={5}
        existingError="File upload failed"
      />
    );

    // Should display the error message
    expect(screen.getByText('File upload failed')).toBeInTheDocument();
  });
});
