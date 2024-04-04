class AuthenticationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Invalid Authentication';
    this.statusCode = 401;
    this.code = 'UNAUTHORIZED';
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.name = 'ConflictError';
    this.statusCode = 409;
    this.code = 'CONFLICT';
    // this.extensions = { code: 'CONFLICT', statusCode: 409 };
  }
}
