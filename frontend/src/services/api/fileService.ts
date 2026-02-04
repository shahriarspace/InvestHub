import apiClient from './apiClient';

export type FileType = 'PROFILE_PHOTO' | 'STARTUP_LOGO' | 'PITCH_DECK' | 'INVESTOR_PHOTO';

export interface FileUpload {
  id: string;
  userId: string;
  fileName: string;
  originalFileName: string;
  contentType: string;
  fileSize: number;
  fileType: FileType;
  referenceId?: string;
  downloadUrl: string;
  createdAt: string;
}

export const fileService = {
  async uploadFile(file: File, fileType: FileType, referenceId?: string): Promise<FileUpload> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileType', fileType);
    if (referenceId) {
      formData.append('referenceId', referenceId);
    }

    const response = await apiClient.post<FileUpload>('/files/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getFileMetadata(fileId: string): Promise<FileUpload> {
    const response = await apiClient.get<FileUpload>(`/files/${fileId}`);
    return response.data;
  },

  getDownloadUrl(fileId: string): string {
    return `/api/files/${fileId}/download`;
  },

  async getFilesByReference(referenceId: string): Promise<FileUpload[]> {
    const response = await apiClient.get<FileUpload[]>(`/files/by-reference/${referenceId}`);
    return response.data;
  },

  async getFilesByReferenceAndType(referenceId: string, fileType: FileType): Promise<FileUpload[]> {
    const response = await apiClient.get<FileUpload[]>(
      `/files/by-reference/${referenceId}/type/${fileType}`
    );
    return response.data;
  },

  async getMyFiles(): Promise<FileUpload[]> {
    const response = await apiClient.get<FileUpload[]>('/files/my-files');
    return response.data;
  },

  async deleteFile(fileId: string): Promise<void> {
    await apiClient.delete(`/files/${fileId}`);
  },
};

export default fileService;
