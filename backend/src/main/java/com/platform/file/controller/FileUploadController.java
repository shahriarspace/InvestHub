package com.platform.file.controller;

import com.platform.file.model.FileUpload;
import com.platform.file.model.FileUploadDTO;
import com.platform.file.model.FileType;
import com.platform.file.service.FileUploadService;
import com.platform.util.SecurityUtil;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final FileUploadService fileUploadService;

    public FileUploadController(FileUploadService fileUploadService) {
        this.fileUploadService = fileUploadService;
    }

    @PostMapping("/upload")
    public ResponseEntity<FileUploadDTO> uploadFile(
            @RequestParam("file") MultipartFile file,
            @RequestParam("fileType") FileType fileType,
            @RequestParam(value = "referenceId", required = false) UUID referenceId) {
        try {
            UUID userId = SecurityUtil.getCurrentUserId();
            FileUploadDTO uploadedFile = fileUploadService.uploadFile(file, userId, fileType, referenceId);
            return ResponseEntity.ok(uploadedFile);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        } catch (IOException e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<FileUploadDTO> getFileMetadata(@PathVariable UUID id) {
        return fileUploadService.getFileById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable UUID id) {
        try {
            FileUpload fileUpload = fileUploadService.getFileUploadById(id);
            if (fileUpload == null) {
                return ResponseEntity.notFound().build();
            }

            Resource resource = fileUploadService.downloadFile(id);
            
            return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(fileUpload.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, 
                    "attachment; filename=\"" + fileUpload.getOriginalFileName() + "\"")
                .body(resource);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/by-reference/{referenceId}")
    public ResponseEntity<List<FileUploadDTO>> getFilesByReference(@PathVariable UUID referenceId) {
        List<FileUploadDTO> files = fileUploadService.getFilesByReferenceId(referenceId);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/by-reference/{referenceId}/type/{fileType}")
    public ResponseEntity<List<FileUploadDTO>> getFilesByReferenceAndType(
            @PathVariable UUID referenceId,
            @PathVariable FileType fileType) {
        List<FileUploadDTO> files = fileUploadService.getFilesByReferenceIdAndType(referenceId, fileType);
        return ResponseEntity.ok(files);
    }

    @GetMapping("/my-files")
    public ResponseEntity<List<FileUploadDTO>> getMyFiles() {
        UUID userId = SecurityUtil.getCurrentUserId();
        List<FileUploadDTO> files = fileUploadService.getFilesByUserId(userId);
        return ResponseEntity.ok(files);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFile(@PathVariable UUID id) {
        UUID userId = SecurityUtil.getCurrentUserId();
        boolean deleted = fileUploadService.deleteFile(id, userId);
        if (deleted) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
