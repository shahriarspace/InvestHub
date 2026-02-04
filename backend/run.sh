#!/bin/bash
cd /c/workspaces/invest/backend

# Download dependencies and compile
echo "Building Spring Boot application..."
mvn -U clean compile 2>&1 | tail -20

# If compilation succeeded, run
if [ $? -eq 0 ]; then
    echo "Build successful! Starting application..."
    mvn spring-boot:run -Dspring-boot.run.arguments="--spring.profiles.active=mock"
else
    echo "Build failed"
    exit 1
fi
