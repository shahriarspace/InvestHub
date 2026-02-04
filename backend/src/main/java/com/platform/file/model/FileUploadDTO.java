package com.platform.file.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class FileUploadDTO {
    private UUID id;
    private UUID userId;
    private String fileName;
    private String originalFileName;
    private String contentType;
    private Long fileSize;
    private FileType fileType;
    private UUID referenceId;
    private String downloadUrl;
    private LocalDateTime createdAt;

    public FileUploadDTO() {}

    public FileUploadDTO(FileUpload fileUpload) {
        this.id = fileUpload.getId();
        this.userId = fileUpload.getUserId();
        this.fileName = fileUpload.getFileName();
        this.originalFileName = fileUpload.getOriginalFileName();
        this.contentType = fileUpload.getContentType();
        this.fileSize = fileUpload.getFileSize();
        this.fileType = fileUpload.getFileType();
        this.referenceId = fileUpload.getReferenceId();
        this.downloadUrl = "/api/files/" + fileUpload.getId() + "/download";
        this.createdAt = fileUpload.getCreatedAt();
    }

    // Getters
    public UUID getId() { return id; }
    public UUID getUserId() { return userId; }
    public String getFileName() { return fileName; }
    public String getOriginalFileName() { return originalFileName; }
    public String getContentType() { return contentType; }
    public Long getFileSize() { return fileSize; }
    public FileType getFileType() { return fileType; }
    public UUID getReferenceId() { return referenceId; }
    public String getDownloadUrl() { return downloadUrl; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Setters
    public void setId(UUID id) { this.id = id; }
    public void setUserId(UUID userId) { this.userId = userId; }
    public void setFileName(String fileName) { this.fileName = fileName; }
    public void setOriginalFileName(String originalFileName) { this.originalFileName = originalFileName; }
    public void setContentType(String contentType) { this.contentType = contentType; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
    public void setFileType(FileType fileType) { this.fileType = fileType; }
    public void setReferenceId(UUID referenceId) { this.referenceId = referenceId; }
    public void setDownloadUrl(String downloadUrl) { this.downloadUrl = downloadUrl; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
