class ServiceErrors {
  static NOT_AUTHORIZED = {
    statusCode: 401,
    message: 'User is not authorized',
  };

  static TOKEN_NOT_PROVIDED = {
    statusCode: 400,
    message: 'Please request with a valid token',
  };
  static NOT_FOUND = {
    statusCode: 404,
    message: 'Resource not found',
  };

  static UNKNOWN_ERROR = {
    statusCode: 500,
    message: 'Unknown error occured',
  };
}

export class ServiceError {
  error: any;
  constructor(error: keyof typeof ServiceErrors) {
    console.log('error at constructor', error);
    this.error = { ...(ServiceErrors[error] ?? ServiceErrors['UNKNOWN_ERROR']) };
  }
}
