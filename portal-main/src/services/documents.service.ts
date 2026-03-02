/**
 * Documents service - handles all document-related API calls
 */

import { API_V1_BASE_URL } from '../config/api'
import { Document } from '../types/documents'
import { getAccessToken } from '../utils/authStorage'

function getAuthHeaders(): Record<string, string> {
  const token = getAccessToken()
  const headers: Record<string, string> = {}
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }
  return headers
}

/**
 * Get all documents for the current user
 * @returns Promise with array of documents
 */
export const getDocuments = async (): Promise<Document[]> => {
  const response = await fetch(`${API_V1_BASE_URL}/documents/`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    return []
  }
  return response.json()
}

/**
 * Get documents by type (SYSTEM or USER)
 * @param _type - Document type filter
 * @returns Promise with filtered documents
 */
export const getDocumentsByType = async (_type: 'SYSTEM' | 'USER'): Promise<Document[]> => {
  const response = await fetch(`${API_V1_BASE_URL}/documents/?type=${_type}`, {
    headers: getAuthHeaders(),
  })
  if (!response.ok) {
    return []
  }
  return response.json()
}

/**
 * Upload a new document
 * @param _file - File to upload
 * @param _documentType - Type of document (SYSTEM or USER)
 * @returns Promise with upload result
 */
export const uploadDocument = async (_file: File): Promise<boolean> => {
  const formData = new FormData()
  formData.append('file', _file)

  const response = await fetch(`${API_V1_BASE_URL}/documents/`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  })

  return response.ok
}

/**
 * Replace an existing document
 * @param _documentId - ID of document to replace
 * @param _file - New file
 * @returns Promise with replacement result
 */
export const replaceDocument = async (_documentId: string, _file: File): Promise<boolean> => {
  const formData = new FormData()
  formData.append('file', _file)

  const response = await fetch(`${API_V1_BASE_URL}/documents/${_documentId}/replace/`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: formData,
  })

  return response.ok
}

/**
 * Delete a document
 * @param _documentId - ID of document to delete
 * @returns Promise with deletion result
 */
export const deleteDocument = async (_documentId: string): Promise<boolean> => {
  console.log('[Documents] Attempting to delete document:', _documentId);
  
  try {
    const response = await fetch(`${API_V1_BASE_URL}/documents/${_documentId}/`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    })

    console.log('[Documents] Delete response status:', response.status);
    
    // 204 No Content is the success response for DELETE
    if (response.status === 204) {
      console.log('[Documents] Document deleted successfully (204)');
      return true;
    }
    
    // Some APIs return 200 with empty body
    if (response.status === 200) {
      console.log('[Documents] Document deleted successfully (200)');
      return true;
    }
    
    // Try to parse error response
    try {
      const errorData = await response.json();
      console.error('[Documents] Delete failed:', errorData);
    } catch {
      console.error('[Documents] Delete failed with status:', response.status);
    }
    
    return false;
  } catch (error) {
    console.error('[Documents] Delete error:', error);
    return false;
  }
}

/**
 * View a document in a new tab
 * @param documentId - ID of document to view
 * @returns Promise with view result
 */
export const viewDocument = async (documentId: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_V1_BASE_URL}/documents/${documentId}/download/`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      return false
    }

    // Get the blob from response
    const blob = await response.blob()
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob)
    
    // Open in new tab
    window.open(url, '_blank', 'noopener,noreferrer')
    
    // Clean up after a delay to allow the tab to load
    setTimeout(() => {
      window.URL.revokeObjectURL(url)
    }, 1000)
    
    return true
  } catch (error) {
    console.error('View error:', error)
    return false
  }
}

/**
 * Download a document
 * @param documentId - ID of document to download
 * @param fileName - Name to save the file as
 * @returns Promise with download result
 */
export const downloadDocument = async (documentId: string, fileName: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_V1_BASE_URL}/documents/${documentId}/download/`, {
      headers: getAuthHeaders(),
    })

    if (!response.ok) {
      return false
    }

    // Get the blob from response
    const blob = await response.blob()
    
    // Create a temporary URL for the blob
    const url = window.URL.createObjectURL(blob)
    
    // Create a temporary anchor element and trigger download
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    
    // Clean up
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    return true
  } catch (error) {
    console.error('Download error:', error)
    return false
  }
}

