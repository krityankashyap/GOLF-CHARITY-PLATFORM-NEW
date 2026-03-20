import ClientError from './ClientError.js';

class ValidationError extends ClientError {
  constructor(errors) {
    super('ValidationError', 'Validation failed', 422);
    this.errors = errors;
  }
}

export default ValidationError;
