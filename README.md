# ComicK API Server

An Express.js server that fetches data from the ComicK API and serves it at the `/top` endpoint.

## Features

- Fetches top manga data from `https://api.comick.io/top`
- Serves data at `/top` endpoint
- Includes CORS support for cross-origin requests
- Comprehensive error handling
- Health check endpoint
- Request timeout protection

## Installation

1. Navigate to the project directory:
   ```bash
   cd comick-api
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Usage

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will start on port 3000 by default. You can change this by setting the `PORT` environment variable.

## API Endpoints

### GET `/top`
Fetches top manga data from the ComicK API.

**Response:** JSON data from the ComicK API

**Example:**
```bash
curl http://localhost:3000/top
```

### GET `/health`
Health check endpoint to verify the server is running.

**Response:**
```json
{
  "status": "OK",
  "message": "ComicK API server is running"
}
```

### GET `/`
Root endpoint that provides information about available endpoints.

**Response:**
```json
{
  "message": "ComicK API Server",
  "endpoints": {
    "/top": "Get top manga from ComicK API",
    "/health": "Health check endpoint"
  }
}
```

## Error Handling

The server includes comprehensive error handling for:
- Network timeouts
- API server errors
- Invalid responses
- Internal server errors

All errors return appropriate HTTP status codes and error messages.

## Dependencies

- **express**: Web framework for Node.js
- **axios**: HTTP client for making requests to the ComicK API
- **cors**: Cross-Origin Resource Sharing middleware
- **nodemon**: Development dependency for auto-restarting the server

## Environment Variables

- `PORT`: Port number for the server (default: 3000) 