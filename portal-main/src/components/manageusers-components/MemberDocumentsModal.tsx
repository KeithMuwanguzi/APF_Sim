import { useState, useEffect } from 'react';
import { userManagementApi } from '../../services/manageuser';
import { API_BASE_URL } from '../../config/api';
import { getAccessToken } from '../../utils/authStorage';

interface Document {
  id: string;
  name: string;
  type: string;
  status: string;
  uploadedDate: string;
  adminFeedback?: string;
  fileUrl?: string;
}

interface MemberDocumentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  userName: string;
}

const MemberDocumentsModal = ({ isOpen, onClose, userId, userName }: MemberDocumentsModalProps) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [viewingDoc, setViewingDoc] = useState<Document | null>(null);
  const [imageBlob, setImageBlob] = useState<string | null>(null);
  const [loadingImage, setLoadingImage] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (isOpen && userId) {
      fetchDocuments();
    }
  }, [isOpen, userId]);

  // Fetch image with authentication when viewing a document
  useEffect(() => {
    if (viewingDoc?.fileUrl) {
      fetchAuthenticatedFile(viewingDoc.fileUrl);
    } else {
      setImageBlob(null);
    }
  }, [viewingDoc]);

  const fetchAuthenticatedFile = async (url: string) => {
    try {
      setLoadingImage(true);
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${getAccessToken()}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to load file: ${response.statusText}`);
      }
      
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      setImageBlob(blobUrl);
    } catch (err: any) {
      console.error('Error fetching authenticated file:', err);
      setImageBlob(null);
    } finally {
      setLoadingImage(false);
    }
  };

  useEffect(() => {
    if (isOpen && userId) {
      fetchDocuments();
    }
  }, [isOpen, userId]);

  const fetchDocuments = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log(`[Modal] Fetching documents for user ID: ${userId}`);
      const data = await userManagementApi.fetchMemberDocuments(userId);
      console.log('[Modal] Received data:', data);
      console.log('[Modal] Documents array:', data.documents);
      console.log('[Modal] Total documents:', data.total_documents);
      setDocuments(data.documents || []);
    } catch (err: any) {
      console.error('[Modal] Error fetching documents:', err);
      console.error('[Modal] Error response:', err.response?.data);
      setError(err.response?.data?.error?.message || err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (docId: string, status: string) => {
    try {
      setUpdating(true);
      await userManagementApi.updateDocumentStatus(docId, status, feedback);
      await fetchDocuments();
      setSelectedDoc(null);
      setFeedback('');
    } catch (err: any) {
      alert(err.response?.data?.error?.message || 'Failed to update document status');
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#5E2590] to-purple-700 text-white px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">Member Documents</h2>
            <p className="text-purple-100 text-sm mt-1">{userName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-8 h-8 border-3 border-[#5E2590] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-500 mt-3">Loading documents...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl">
              {error}
            </div>
          ) : documents.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-gray-500 font-medium">No documents uploaded yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-[#5E2590]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h3 className="font-semibold text-gray-800">{doc.name}</h3>
                      </div>
                      <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
                        <span>Type: {doc.type}</span>
                        <span>•</span>
                        <span>Uploaded: {new Date(doc.uploadedDate).toLocaleDateString()}</span>
                      </div>
                      {doc.adminFeedback && (
                        <div className="mt-2 bg-gray-50 rounded-lg p-3">
                          <p className="text-xs font-semibold text-gray-600 mb-1">Admin Feedback:</p>
                          <p className="text-sm text-gray-700">{doc.adminFeedback}</p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(doc.status)}`}>
                        {doc.status}
                      </span>
                      <div className="flex gap-2">
                        {/* View Button */}
                        <button
                          onClick={() => setViewingDoc(doc)}
                          className="px-3 py-1 bg-blue-600 text-white text-xs rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                        
                        {/* Review Button */}
                        {selectedDoc?.id === doc.id ? (
                          <div className="mt-2 space-y-2">
                            <textarea
                              value={feedback}
                              onChange={(e) => setFeedback(e.target.value)}
                              placeholder="Add feedback (optional)"
                              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm resize-none"
                              rows={2}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleUpdateStatus(doc.id, 'approved')}
                                disabled={updating}
                                className="px-3 py-1 bg-green-600 text-white text-xs rounded-lg hover:bg-green-700 disabled:opacity-50"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleUpdateStatus(doc.id, 'rejected')}
                                disabled={updating}
                                className="px-3 py-1 bg-red-600 text-white text-xs rounded-lg hover:bg-red-700 disabled:opacity-50"
                              >
                                Reject
                              </button>
                              <button
                                onClick={() => {
                                  setSelectedDoc(null);
                                  setFeedback('');
                                }}
                                className="px-3 py-1 bg-gray-300 text-gray-700 text-xs rounded-lg hover:bg-gray-400"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedDoc(doc)}
                            className="px-3 py-1 bg-[#5E2590] text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Total Documents: <span className="font-semibold">{documents.length}</span>
            </p>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-[#5E2590] text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
            >
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Document Viewer Popup */}
      {viewingDoc && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl aspect-square max-h-[90vh] overflow-hidden flex flex-col">
            {/* Viewer Header */}
            <div className="bg-gradient-to-r from-[#5E2590] to-purple-700 text-white px-6 py-3 flex justify-between items-center flex-shrink-0">
              <div className="min-w-0 flex-1">
                <h3 className="text-lg font-bold truncate">{viewingDoc.name}</h3>
                <p className="text-purple-100 text-sm mt-1">
                  Uploaded: {new Date(viewingDoc.uploadedDate).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => setViewingDoc(null)}
                className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors flex-shrink-0 ml-4"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Viewer Content - Scrollable */}
            <div className="flex-1 overflow-auto bg-gray-100 p-6 min-h-0">
              {loadingImage ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="w-8 h-8 border-3 border-[#5E2590] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-gray-500 mt-3">Loading file...</p>
                </div>
              ) : viewingDoc.fileUrl && imageBlob ? (
                <div className="h-full flex items-center justify-center">
                  {/* Check file type and render accordingly */}
                  {viewingDoc.name.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i) ? (
                    // Image viewer - fit within preview window
                    <img
                      src={imageBlob}
                      alt={viewingDoc.name}
                      className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
                    />
                  ) : viewingDoc.name.match(/\.pdf$/i) ? (
                    // PDF viewer - full width, scrollable
                    <div className="w-full h-full min-h-[500px]">
                      <iframe
                        src={imageBlob}
                        className="w-full h-full rounded-lg shadow-lg"
                        title={viewingDoc.name}
                      />
                    </div>
                  ) : (
                    // Other file types - show download option
                    <div className="text-center w-full py-12">
                      <svg className="w-20 h-20 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-gray-600 mb-4">Preview not available for this file type</p>
                      <button
                        onClick={async () => {
                          if (imageBlob) {
                            const link = document.createElement('a');
                            link.href = imageBlob;
                            link.download = viewingDoc.name;
                            link.click();
                          }
                        }}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-[#5E2590] text-white rounded-lg hover:bg-purple-700 transition-colors"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download File
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center h-full flex items-center justify-center">
                  <p className="text-gray-500">Unable to load file preview</p>
                </div>
              )}
            </div>

            {/* Viewer Footer */}
            <div className="border-t border-gray-200 px-6 py-3 bg-gray-50 flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-4 min-w-0 flex-1">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase flex-shrink-0 ${getStatusColor(viewingDoc.status)}`}>
                  {viewingDoc.status}
                </span>
                {viewingDoc.adminFeedback && (
                  <span className="text-sm text-gray-600 truncate">
                    Feedback: {viewingDoc.adminFeedback}
                  </span>
                )}
              </div>
              <div className="flex gap-2 flex-shrink-0 ml-4">
                <button
                  onClick={async () => {
                    if (imageBlob) {
                      const link = document.createElement('a');
                      link.href = imageBlob;
                      link.download = viewingDoc.name;
                      link.click();
                    }
                  }}
                  className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
                >
                  Download
                </button>
                <button
                  onClick={() => {
                    setViewingDoc(null);
                    setSelectedDoc(viewingDoc);
                  }}
                  className="px-4 py-2 bg-[#5E2590] text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberDocumentsModal;
