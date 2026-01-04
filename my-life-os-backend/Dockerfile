FROM golang:1.21-alpine

# Install Air for hot reload
RUN go install github.com/cosmtrek/air@latest

WORKDIR /app

# Copy go mod files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy source code
COPY . .

# Expose port
EXPOSE 8080

# Run with Air (hot reload)
CMD ["air", "-c", ".air.toml"]