class ClientError extends Error {
  constructor(name, message, statusCode = 400, explanation = '') {
    super(message);
    this.name = name;
    this.statusCode = statusCode;
    this.explanation = explanation;
  }
}

export default ClientError;
