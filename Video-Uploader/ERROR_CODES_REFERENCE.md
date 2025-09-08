# 🚨 Video-Uploader Project - Error Codes & Status Reference

This document provides a comprehensive list of all error codes and HTTP status codes that can originate from your Video-Uploader project, along with their meanings and handling strategies.

## 📋 HTTP Status Codes Used

### 2xx Success
- **200**: OK - Successful GET, PUT, DELETE operations
- **201**: Created - Successful video upload/creation

### 4xx Client Errors
- **400**: Bad Request - Invalid data, malformed JSON, invalid video URL
- **401**: Unauthorized - Invalid API key, authentication required
- **403**: Forbidden - Access denied to resources
- **404**: Not Found - Video not found, endpoint not found
- **405**: Method Not Allowed - HTTP method not supported for endpoint
- **409**: Conflict - Duplicate video entry
- **413**: Payload Too Large - File size exceeds maximum limit
- **422**: Unprocessable Entity - Validation errors
- **429**: Too Many Requests - Rate limit exceeded

### 5xx Server Errors
- **500**: Internal Server Error - Generic server error, configuration issues
- **502**: Bad Gateway - External API (Bunny.net) errors
- **503**: Service Unavailable - Database connection failed

---

## 🏷️ Custom Error Codes

### Authentication & Authorization
| Error Code | HTTP Status | Description | When It Occurs |
|------------|-------------|-------------|----------------|
| `UNAUTHORIZED` | 401 | Authentication required | Missing or invalid authentication |
| `INVALID_TOKEN` | 401 | Invalid API token | Expired or malformed API token |

### Validation Errors
| Error Code | HTTP Status | Description | When It Occurs |
|------------|-------------|-------------|----------------|
| `VALIDATION_ERROR` | 422 | Request validation failed | Invalid input data, missing required fields |

### External API Errors (Bunny.net)
| Error Code | HTTP Status | Description | When It Occurs |
|------------|-------------|-------------|----------------|
| `EXTERNAL_API_BAD_REQUEST` | 400 | Invalid request to video service | Bad data sent to Bunny.net |
| `EXTERNAL_API_UNAUTHORIZED` | 401 | Video service authentication failed | Invalid Bunny.net API key |
| `EXTERNAL_API_FORBIDDEN` | 403 | Access denied to video service | Insufficient permissions |
| `EXTERNAL_VIDEO_NOT_FOUND` | 404 | Video not found in external service | Video doesn't exist in Bunny.net |
| `EXTERNAL_API_ERROR` | 502 | Video service unavailable | Bunny.net service down |
| `REQUEST_TIMEOUT` | 502 | Request to video service timed out | Network timeout to Bunny.net |
| `NETWORK_ERROR` | 502 | Failed to connect to video service | Network connectivity issues |

### Database Errors
| Error Code | HTTP Status | Description | When It Occurs |
|------------|-------------|-------------|----------------|
| `VIDEO_ALREADY_EXISTS` | 409 | Video already exists in database | Duplicate video entry |
| `FOREIGN_KEY_ERROR` | 400 | Referenced record doesn't exist | Invalid foreign key reference |
| `DATABASE_SCHEMA_ERROR` | 500 | Database schema error | Column doesn't exist, schema mismatch |
| `DATABASE_CONNECTION_ERROR` | 503 | Database connection failed | MySQL server down or unreachable |

### Route & Method Errors
| Error Code | HTTP Status | Description | When It Occurs |
|------------|-------------|-------------|----------------|
| `ENDPOINT_NOT_FOUND` | 404 | Requested endpoint not found | Invalid API endpoint |
| `METHOD_NOT_ALLOWED` | 405 | HTTP method not allowed | Wrong HTTP verb for endpoint |

### Video-Specific Errors
| Error Code | HTTP Status | Description | When It Occurs |
|------------|-------------|-------------|----------------|
| `VIDEO_NOT_FOUND` | 404 | Video not found | Video doesn't exist in database |
| `VIDEO_PROCESSING_FAILED` | 422 | Video processing failed | Error during video processing |
| `INVALID_VIDEO_URL` | 400 | Invalid video URL provided | Malformed or inaccessible URL |
| `VIDEO_UPLOAD_FAILED` | 400 | Video upload failed | Upload to Bunny.net failed |
| `WEBHOOK_VALIDATION_FAILED` | 400 | Invalid webhook data | Malformed webhook payload |

### File & Storage Errors
| Error Code | HTTP Status | Description | When It Occurs |
|------------|-------------|-------------|----------------|
| `FILE_NOT_FOUND` | 404 | File not found | Requested file doesn't exist |
| `FILE_ACCESS_DENIED` | 403 | File access denied | Insufficient file permissions |

### Rate Limiting & Quota Errors
| Error Code | HTTP Status | Description | When It Occurs |
|------------|-------------|-------------|----------------|
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests | API rate limit exceeded |

### Content & Format Errors
| Error Code | HTTP Status | Description | When It Occurs |
|------------|-------------|-------------|----------------|
| `INVALID_JSON` | 400 | Invalid JSON in request body | Malformed JSON payload |
| `FILE_TOO_LARGE` | 413 | File size exceeds limit | File exceeds maximum size |

### Configuration & System Errors
| Error Code | HTTP Status | Description | When It Occurs |
|------------|-------------|-------------|----------------|
| `CONFIGURATION_ERROR` | 500 | Server configuration error | Missing environment variables |
| `INTERNAL_ERROR` | 500 | Generic internal error | Unknown server error |

---

## 🗂️ Error Categories by Source

### 1. **Validation Errors** (Input)
- Triggered by: Invalid request data, missing fields, wrong data types
- HTTP Status: `422`
- Error Code: `VALIDATION_ERROR`
- Response includes: Field-specific error messages

### 2. **Network/External Errors** (Bunny.net)
- Triggered by: Bunny.net API failures, network issues
- HTTP Status: `400-502`
- Error Codes: `EXTERNAL_*`, `NETWORK_ERROR`, `REQUEST_TIMEOUT`
- Common causes: Invalid API key, service downtime, network issues

### 3. **Database Errors** (MySQL)
- Triggered by: Database connection issues, schema problems, data conflicts
- HTTP Status: `400`, `409`, `500`, `503`
- Error Codes: `DATABASE_*`, `VIDEO_ALREADY_EXISTS`
- Common causes: DB server down, schema mismatch, duplicate entries

### 4. **Application Logic Errors** (Business Logic)
- Triggered by: Video not found, processing failures
- HTTP Status: `400-422`
- Error Codes: `VIDEO_*`, `INVALID_VIDEO_URL`
- Common causes: Invalid operations, missing resources

### 5. **System/Infrastructure Errors** (Server)
- Triggered by: Configuration issues, file system problems
- HTTP Status: `500`, `503`
- Error Codes: `CONFIGURATION_ERROR`, `FILE_*`
- Common causes: Missing env vars, file permissions, system resources

---

## 🔄 Error Response Format

All errors follow this consistent JSON structure:

```json
{
  "success": false,
  "message": "Human-readable error description",
  "error_code": "MACHINE_READABLE_ERROR_CODE",
  "statusCode": 400,
  "errors": {
    // Field-specific validation errors (if applicable)
  },
  "details": {
    // Additional error details (development only)
  }
}
```

---

## 📊 Error Logging & Monitoring

### Log Levels by Status Code
- **5xx errors**: `Logger.error()` - Critical issues requiring immediate attention
- **4xx errors**: `Logger.warn()` - Client errors that may need monitoring
- **Others**: `Logger.info()` - General application errors

### What Gets Logged
- Error message and stack trace
- Request URL and HTTP method
- Client IP address and User-Agent
- Timestamp and environment
- Error code and status

### Excluded from External Reporting
- Validation errors (`422`)
- Authentication errors (`401`)
- Not found errors (`404`)
- Method not allowed (`405`)

---

## 🛠️ Integration Examples

### Frontend Error Handling
```javascript
try {
  const response = await fetch('/api/videos', {
    method: 'POST',
    body: JSON.stringify(videoData)
  });
  
  if (!response.ok) {
    const error = await response.json();
    
    switch(error.error_code) {
      case 'VALIDATION_ERROR':
        showValidationErrors(error.errors);
        break;
      case 'EXTERNAL_API_UNAUTHORIZED':
        showMessage('API configuration error - contact support');
        break;
      case 'VIDEO_ALREADY_EXISTS':
        showMessage('This video has already been uploaded');
        break;
      default:
        showMessage(error.message);
    }
  }
} catch (err) {
  showMessage('Network error - please try again');
}
```

### External Monitoring Integration
```javascript
// In your error handler
if (error.status >= 500) {
  // Send to Sentry, Bugsnag, etc.
  Sentry.captureException(error, {
    tags: {
      error_code: error.error_code,
      endpoint: request.url()
    }
  });
}
```

---

## 🚨 Common Error Scenarios

### 1. Video Upload Failed
**Possible Causes:**
- Invalid video URL (`INVALID_VIDEO_URL`)
- Bunny.net API issues (`EXTERNAL_API_*`)
- Network timeout (`REQUEST_TIMEOUT`)

### 2. Database Connection Issues
**Error Codes:**
- `DATABASE_CONNECTION_ERROR` (503)
- `DATABASE_SCHEMA_ERROR` (500)

### 3. Validation Failures
**Error Code:** `VALIDATION_ERROR` (422)
**Common Fields:**
- `url.required`: Video URL is required
- `url.url`: Invalid URL format
- `id.uuid`: Invalid video ID format

### 4. External API Failures
**Error Codes:**
- `EXTERNAL_API_UNAUTHORIZED` (401): Check API key
- `EXTERNAL_API_ERROR` (502): Bunny.net service down
- `EXTERNAL_VIDEO_NOT_FOUND` (404): Video doesn't exist

---

This central error handler provides consistent, user-friendly error responses while maintaining proper logging for monitoring and debugging. All errors are categorized and handled appropriately based on their severity and type.
