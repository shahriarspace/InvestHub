@echo off
REM Start Spring Boot Backend
cd /c/workspaces/invest/backend
echo Starting Spring Boot Backend...
echo Backend will be available at: http://localhost:8080
echo.
echo Using Mock profile (H2 in-memory database)
mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mock"
