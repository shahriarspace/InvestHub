package com.platform.file.repository;

import com.platform.file.model.FileUpload;
import com.platform.file.model.FileType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface FileUploadRepository extends JpaRepository<FileUpload, UUID> {
    
    List<FileUpload> findByReferenceId(UUID referenceId);
    
    List<FileUpload> findByReferenceIdAndFileType(UUID referenceId, FileType fileType);
    
    List<FileUpload> findByUserId(UUID userId);
    
    Optional<FileUpload> findByReferenceIdAndFileTypeAndUserId(UUID referenceId, FileType fileType, UUID userId);
    
    List<FileUpload> findByUserIdAndFileType(UUID userId, FileType fileType);
}
