import { 
  FileText, 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertTriangle,
  Eye,
  Upload,
  Download,
  Trash2
} from "lucide-react"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Document, isExpired } from "../../types/documents"

interface DocumentCardProps {
  document: Document
  onView?: (doc: Document) => void
  onReupload?: (doc: Document) => void
  onDownload?: (doc: Document) => void
  onRemove?: (doc: Document) => void
}

export const DocumentCard: React.FC<DocumentCardProps> = ({ 
  document, 
  onView, 
  onReupload,
  onDownload,
  onRemove
}) => {
  const expired = isExpired(document.expiryDate)
  const status = expired ? 'expired' : document.status

  // Status badge configuration
  const statusConfig = {
    approved: {
      icon: CheckCircle,
      className: "bg-green-100 text-green-700",
      label: "Approved"
    },
    pending: {
      icon: Clock,
      className: "bg-yellow-100 text-yellow-700",
      label: "Pending Review"
    },
    rejected: {
      icon: XCircle,
      className: "bg-red-100 text-red-700",
      label: "Rejected"
    },
    expired: {
      icon: AlertTriangle,
      className: "bg-orange-100 text-orange-700",
      label: "Expired"
    }
  }

  const config = statusConfig[status as keyof typeof statusConfig]
  const StatusIcon = config.icon

  // Conditional actions based on status
  const canView = Boolean(document.fileUrl)
  const showReupload = expired || document.status === 'rejected'
  const showRemove = document.status === 'pending' || document.status === 'rejected'

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-5 hover:border-purple-300 hover:shadow-md transition-all h-full flex flex-col">
      {/* Header with icon and status */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 text-sm leading-tight">{document.name}</h3>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mb-4">
        <Badge className={`${config.className} flex items-center gap-1 w-fit`}>
          <StatusIcon className="w-3 h-3" />
          {config.label}
        </Badge>
      </div>

      {/* Document metadata */}
      <div className="space-y-2 mb-4 flex-1">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Uploaded:</span>
          <span className="text-gray-900 font-medium">{document.uploadedDate}</span>
        </div>
        
        {document.expiryDate && (
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Expires:</span>
            <span className={`font-medium ${expired ? 'text-orange-600' : 'text-gray-900'}`}>
              {document.expiryDate}
            </span>
          </div>
        )}

        {document.adminFeedback && (
          <div className="bg-purple-50 border-l-2 border-purple-600 p-2 rounded text-xs mt-3">
            <p className="text-gray-700">{document.adminFeedback}</p>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        {/* View - Always available if fileUrl exists */}
        {canView && onView && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onView(document)}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Eye className="w-4 h-4" />
            View
          </Button>
        )}
        
        {/* Download - Always available if fileUrl exists */}
        {canView && onDownload && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => onDownload(document)}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download
          </Button>
        )}
        
        {/* Replace - Only for expired or rejected documents */}
        {showReupload && onReupload && (
          <Button 
            size="sm"
            onClick={() => onReupload(document)}
            className="flex-1 bg-purple-600 hover:bg-purple-700 flex items-center justify-center gap-2"
          >
            <Upload className="w-4 h-4" />
            Replace
          </Button>
        )}
        
        {/* Remove - Only for pending or rejected documents */}
        {showRemove && onRemove && (
          <Button 
            variant="outline"
            size="sm"
            onClick={() => onRemove(document)}
            className="flex-1 flex items-center justify-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
          >
            <Trash2 className="w-4 h-4" />
            Remove
          </Button>
        )}
      </div>
    </div>
  )
}
