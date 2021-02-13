/**
 * Module dependencies
 */
const AppErrorCodes = {
  serverError: 'SERVER_ERROR',
};

interface IMessage {
  message: string;
}

interface IAppErrorOptions {
  details: IMessage[],
  status: number;
  code: string;
}

class AppError extends Error {
  public status: number;

  public code: string;

  public name: string;

  public details: any;

  constructor(message: string, { details, code, status }: Partial<IAppErrorOptions>) {
    super(message);
    // Set HTTP status code
    this.status = status || 500;

    // Set API error code
    this.code = code || AppErrorCodes.serverError;

    // Ensures that stack trace uses our subclass name
    this.name = this.constructor.name;

    // Share clean messages for api feedback
    if (details) this.details = details;
    else this.details = [{ message }];

    // Ensures the AppError subclass is sliced out of the
    // stack trace dump for clarity
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
