import { useState } from "react"
import { CloudUpload, FolderOpen, CheckCircle, Loader2, Info } from "lucide-react"
import { Button } from "../ui/button"
import { toastMessages } from "../../utils/toast-helpers"

interface UploadAreaProps {
  onUpload: (file: File) => Promise<boolean>
  maxSizeMB?: number
  acceptedFormats?: string[]
}

export const UploadArea: React.FC<UploadAreaProps> = ({ 
  onUpload,
  maxSizeMB = 5,
  acceptedFormats = ['.jpg', '.jpeg', '.png', '.pdf']
}) => {
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success'>('idle')
  const [dragOver, setDragOver] = useState(false)

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    const fileSize = (file.size / (1024 * 1024)).toFixed(2)

    if (parseFloat(fileSize) > maxSizeMB) {
      toastMessages.document.sizeLimitExceeded(maxSizeMB)
      return
    }

    setUploadStatus('uploading')
    
    const success = await onUpload(file)
    
    if (success) {
      setUploadStatus('success')
      setTimeout(() => {
        setUploadStatus('idle')
      }, 3000)
    } else {
      setUploadStatus('idle')
      toastMessages.document.uploadFailed()
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    handleFileUpload(e.dataTransfer.files)
  }

  const handleBrowseClick = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = acceptedFormats.join(',')
    input.onchange = (e) => {
      const target = e.target as HTMLInputElement
      handleFileUpload(target.files)
    }
    input.click()
  }

  return (
    <div className="space-y-4">
      <div 
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
          dragOver 
            ? 'border-purple-600 bg-purple-50 scale-[1.01]' 
            : uploadStatus === 'success'
            ? 'border-green-400 bg-green-50'
            : 'border-gray-300 bg-purple-50/20 hover:border-purple-600 hover:bg-purple-50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={uploadStatus === 'idle' ? handleBrowseClick : undefined}
      >
        {uploadStatus === 'success' ? (
          <>
            <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-7 h-7 text-green-600" />
            </div>
            <div className="text-base font-semibold text-gray-900 mb-1">Upload successful!</div>
            <div className="text-sm text-gray-600">Your document will be reviewed by admin</div>
          </>
        ) : uploadStatus === 'uploading' ? (
          <>
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Loader2 className="w-7 h-7 text-purple-600 animate-spin" />
            </div>
            <div className="text-base font-semibold text-gray-900 mb-1">Uploading...</div>
            <div className="text-sm text-gray-600">Please wait</div>
          </>
        ) : (
          <>
            <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CloudUpload className="w-7 h-7 text-purple-600" />
            </div>
            <div className="text-base font-semibold text-gray-900 mb-1">Drag and drop your file here</div>
            <div className="text-sm text-gray-600 mb-4">or browse files on your computer</div>
            <Button 
              onClick={handleBrowseClick}
              className="bg-purple-600 hover:bg-purple-700 flex items-center gap-2"
            >
              <FolderOpen className="w-4 h-4" />
              Browse Files
            </Button>
            <div className="text-xs text-gray-500 mt-3">
              Max {maxSizeMB}MB. Formats: {acceptedFormats.join(', ').toUpperCase()}
            </div>
          </>
        )}
      </div>

      <div className="flex items-start gap-2 text-xs text-gray-500">
        <Info className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <span>Files are securely encrypted and stored. All uploads require admin approval.</span>
      </div>
    </div>
  )
}
