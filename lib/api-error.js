export class ApiError extends Error {
  constructor(message, statusCode = 500, options = {}) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = options.details;
    this.expose = options.expose ?? true;
  }
}

export default ApiError;
