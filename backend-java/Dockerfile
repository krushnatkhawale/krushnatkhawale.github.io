# Multi-stage Docker build for Spring Boot 3.4+ chatbot backend

# Stage 1: Build
FROM gradle:jdk21-alpine AS builder

WORKDIR /app

# Copy Gradle configuration files
COPY build.gradle .
COPY settings.gradle* .
COPY gradle* ./

# Copy source code
COPY src ./src

# Build the application
RUN gradle bootJar --no-daemon --build-cache

# Stage 2: Runtime
FROM eclipse-temurin:21-jre-alpine

# Install curl for health checks (optional)
RUN apk add --no-cache curl

WORKDIR /app

# Copy JAR from builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose port (will be overridden by PORT env var)
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV SPRING_PROFILES_ACTIVE=production

# Run the application
ENTRYPOINT ["sh", "-c", "java -jar app.jar --server.port=${PORT:-8080}"]
