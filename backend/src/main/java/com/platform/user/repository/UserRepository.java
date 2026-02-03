package com.platform.user.repository;

import com.platform.user.model.User;
import com.platform.user.model.UserRole;
import com.platform.user.model.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface UserRepository extends JpaRepository<User, UUID> {
    Optional<User> findByEmail(String email);
    Optional<User> findByGoogleId(String googleId);
    Page<User> findByUserRole(UserRole role, Pageable pageable);
    Page<User> findByStatus(UserStatus status, Pageable pageable);
    Page<User> findAll(Pageable pageable);
}
