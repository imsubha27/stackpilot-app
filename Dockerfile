# Build stage
FROM python:3.11-alpine AS builder

# Install build dependencies for pip packages
RUN apk add --no-cache \
    gcc musl-dev libpq-dev postgresql-dev

# Set working directory
WORKDIR /app

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt


# Final stage
FROM python:3.11-alpine

# Create a non-root user
RUN adduser -D appuser

# Set working directory
WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /usr/local/lib/python3.11 /usr/local/lib/python3.11
COPY --from=builder /usr/local/bin /usr/local/bin
COPY . .

# Change ownership of the application files
RUN chown -R appuser:appuser /app

# Switch to the non-root user
USER appuser

# Expose the application port
EXPOSE 5000

# Command to run the application
CMD ["gunicorn", "-b", "0.0.0.0:5000", "app.app:app"]
