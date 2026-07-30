export class AppError extends Error {
  constructor(code, userMessage, technicalMessage = userMessage, options = {}) {
    super(technicalMessage, options);
    this.name = 'AppError';
    this.code = code;
    this.userMessage = userMessage;
    this.technicalMessage = technicalMessage;
    this.recoverable = options.recoverable ?? true;
  }
}
