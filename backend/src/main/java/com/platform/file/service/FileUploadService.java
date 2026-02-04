package com.platform.file.service;

import com.platform.file.model.FileUpload;
import com.platform.file.model.FileUploadDTO;
import com.platform.file.model.FileType;
import com.platform.file.repository.FileUploadRepository;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FileUploadService {

    private final FileUploadRepository fileUploadRepository;
    private final FileStorageService fileStorageService;

    public FileUploadService(FileUploadRepository fileUploadRepository, 
                            FileStorageService fileStorageService) {
        this.fileUploadRepository = fileUploadRepository;
        this.fileStorageService = fileStorageService;
    }

    @Transactional
    public FileUploadDTO uploadFile(MultipartFile file, UUID userId, FileType fileType, UUID referenceId) throws IOException {
        String storedFileName = fileStorageService.storeFile(file, fileType);

        FileUpload fileUpload = new FileUpload(
            userId,
            storedFileName,
            file.getOriginalFilename(),
            file.getContentType(),
            file.getSize(),
            fileType,
            referenceId
        );

        fileUpload = fileUploadRepository.save(fileUpload);
        return new FileUploadDTO(fileUpload);
    }

    public Optional<FileUploadDTO> getFileById(UUID fileId) {
        return fileUploadRepository.findById(fileId)
            .map(FileUploadDTO::new);
    }

    public Resource downloadFile(UUID fileId) throws MalformedURLException {
        FileUpload fileUpload = fileUploadRepository.findById(fileId)
            .orElseThrow(() -> new RuntimeException("File not found"));
        return fileStorageService.loadFile(fileUpload.getFileName());
    }

    public FileUpload getFileUploadById(UUID fileId) {
        return fileUploadRepository.findById(fileId).orElse(null);
    }

    public List<FileUploadDTO> getFilesByReferenceId(UUID referenceId) {
        return fileUploadRepository.findByReferenceId(referenceId)
            .stream()
            .map(FileUploadDTO::new)
            .collect(Collectors.toList());
    }

    public List<FileUploadDTO> getFilesByReferenceIdAndType(UUID referenceId, FileType fileType) {
        return fileUploadRepository.findByReferenceIdAndFileType(referenceId, fileType)
            .stream()
            .map(FileUploadDTO::new)
            .collect(Collectors.toList());
    }

    public List<FileUploadDTO> getFilesByUserId(UUID userId) {
        return fileUploadRepository.findByUserId(userId)
            .stream()
            .map(FileUploadDTO::new)
            .collect(Collectors.toList());
    }

    @Transactional
    public boolean deleteFile(UUID fileId, UUID userId) {
        Optional<FileUpload> optFileUpload = fileUploadRepository.findById(fileId);
        if (optFileUpload.isPresent()) {
            FileUpload fileUpload = optFileUpload.get();
            // Verify ownership
            if (!fileUpload.getUserId().equals(userId)) {
                return false;
            }
            // Delete physical file
            fileStorageService.deleteFile(fileUpload.getFileName());
            // Delete database record
            fileUploadRepository.delete(fileUpload);
            return true;
        }
        return false;
    }
}
