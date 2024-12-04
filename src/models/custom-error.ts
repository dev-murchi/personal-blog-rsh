export class CustomError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class CustomDatabaseError extends Error {
  constructor(message: string) {
    super(message);
  }
}
