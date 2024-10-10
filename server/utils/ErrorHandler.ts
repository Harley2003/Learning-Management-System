class ErrorHandler extends Error {
  statusCode: Number;
  constructor(message: any, statusCode: Number) {
    super(message);
    this.statusCode = statusCode || 500;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default ErrorHandler;
