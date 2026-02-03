package com.platform.exception;





import java.time.LocalDateTime;





public class ErrorResponse {
    private String message;
    private String errorCode;
    private LocalDateTime timestamp;
    private String path;
    private int status;
}
