import { AxiosError } from 'axios';

// Define custom error types
export class ApiError extends Error {
  public statusCode: number;
  public errorData: any;

  constructor(message: string, statusCode: number, errorData?: any) {
    super(message);
    this.statusCode = statusCode;
    this.errorData = errorData;
    this.name = 'ApiError';
  }
}

export class ValidationError extends ApiError {
  constructor(message: string, errorData?: any) {
    super(message, 400, errorData);
    this.name = 'ValidationError';
  }
}

export class AuthenticationError extends ApiError {
  constructor(message: string = 'Authentication failed') {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends ApiError {
  constructor(message: string = 'Not authorized') {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class NotFoundError extends ApiError {
  constructor(message: string = 'Resource not found') {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

// Error handler function
export const handleApiError = (error: AxiosError): ApiError => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        return new ValidationError('Validation error', data);
      case 401:
        return new AuthenticationError();
      case 403:
        return new AuthorizationError();
      case 404:
        return new NotFoundError();
      case 409:
        return new ApiError(data.message || 'Conflict', status, data);
      case 500:
        return new ApiError('Internal server error', status, data);
      default:
        return new ApiError(data.message || 'An error occurred', status, data);
    }
  } else if (error.request) {
    // Request was made but no response received
    return new ApiError('Network error - no response received', 0);
  } else {
    // Something else happened while setting up the request
    return new ApiError(error.message || 'Request setup error', 0);
  }
};

// Error logging function
export const logError = (error: Error): void => {
  console.error('API Error:', {
    name: error.name,
    message: error.message,
    stack: error.stack,
    ...(error instanceof ApiError && { statusCode: (error as ApiError).statusCode }),
  });
};

// Format error message for user display
export const formatErrorMessage = (error: Error): string => {
  if (error instanceof ValidationError) {
    return 'Please check your input and try again.';
  } else if (error instanceof AuthenticationError) {
    return 'Authentication failed. Please log in again.';
  } else if (error instanceof AuthorizationError) {
    return 'You are not authorized to perform this action.';
  } else if (error instanceof NotFoundError) {
    return 'The requested resource was not found.';
  } else {
    return error.message || 'An unexpected error occurred.';
  }
};