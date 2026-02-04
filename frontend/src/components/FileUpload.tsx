import React, { useRef, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  IconButton,
  LinearProgress,
  Paper,
  Alert,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ImageIcon from '@mui/icons-material/Image';
import { fileService, FileType, FileUpload as FileUploadType } from '../services/api/fileService';

interface FileUploadProps {
  fileType: FileType;
  referenceId?: string;
  onUploadComplete?: (file: FileUploadType) => void;
  onUploadError?: (error: string) => void;
  accept?: string;
  maxSize?: number; // in MB
  label?: string;
  helperText?: string;
  existingFile?: FileUploadType | null;
  onDelete?: (fileId: string) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({
  fileType,
  referenceId,
  onUploadComplete,
  onUploadError,
  accept = fileType === 'PITCH_DECK' ? '.pdf' : 'image/*',
  maxSize = fileType === 'PITCH_DECK' ? 20 : 5,
  label = 'Upload File',
  helperText,
  existingFile,
  onDelete,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [uploadedFile, setUploadedFile] = useState<FileUploadType | null>(existingFile || null);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    const maxBytes = maxSize * 1024 * 1024;
    if (file.size > maxBytes) {
      const errorMsg = `File size exceeds ${maxSize}MB limit`;
      setError(errorMsg);
      onUploadError?.(errorMsg);
      return;
    }

    setError(null);
    setUploading(true);
    setProgress(0);

    // Simulate progress (actual progress tracking would require XMLHttpRequest)
    const progressInterval = setInterval(() => {
      setProgress((prev) => Math.min(prev + 10, 90));
    }, 100);

    try {
      const uploaded = await fileService.uploadFile(file, fileType, referenceId);
      clearInterval(progressInterval);
      setProgress(100);
      setUploadedFile(uploaded);
      onUploadComplete?.(uploaded);
    } catch (err: any) {
      clearInterval(progressInterval);
      const errorMsg = err.response?.data?.message || 'Upload failed';
      setError(errorMsg);
      onUploadError?.(errorMsg);
    } finally {
      setUploading(false);
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDelete = async () => {
    if (!uploadedFile) return;

    try {
      await fileService.deleteFile(uploadedFile.id);
      setUploadedFile(null);
      onDelete?.(uploadedFile.id);
    } catch (err: any) {
      setError('Failed to delete file');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const isImage = fileType !== 'PITCH_DECK';

  return (
    <Box>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {uploadedFile ? (
        <Paper
          variant="outlined"
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {isImage ? (
              <Box
                component="img"
                src={fileService.getDownloadUrl(uploadedFile.id)}
                alt={uploadedFile.originalFileName}
                sx={{
                  width: 60,
                  height: 60,
                  objectFit: 'cover',
                  borderRadius: 1,
                }}
              />
            ) : (
              <InsertDriveFileIcon sx={{ fontSize: 40, color: 'error.main' }} />
            )}
            <Box>
              <Typography variant="body2" fontWeight="medium">
                {uploadedFile.originalFileName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {formatFileSize(uploadedFile.fileSize)}
              </Typography>
            </Box>
          </Box>
          <IconButton color="error" onClick={handleDelete} size="small">
            <DeleteIcon />
          </IconButton>
        </Paper>
      ) : (
        <Paper
          variant="outlined"
          sx={{
            p: 4,
            textAlign: 'center',
            cursor: uploading ? 'default' : 'pointer',
            borderStyle: 'dashed',
            '&:hover': {
              bgcolor: uploading ? 'transparent' : 'action.hover',
            },
          }}
          onClick={uploading ? undefined : handleClick}
        >
          {uploading ? (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Uploading...
              </Typography>
              <LinearProgress variant="determinate" value={progress} sx={{ mx: 4 }} />
            </Box>
          ) : (
            <>
              {isImage ? (
                <ImageIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              ) : (
                <CloudUploadIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 1 }} />
              )}
              <Typography variant="body1" gutterBottom>
                {label}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {helperText || `Click to upload (max ${maxSize}MB)`}
              </Typography>
              <Button
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 2 }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                Choose File
              </Button>
            </>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default FileUpload;
