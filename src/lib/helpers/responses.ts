import { Request, Response } from 'express';

export interface NodeRequest extends Request {
  user?: any;
  page?: any;
  task?: any;
  appleProfile?: any;
  search?: any;
  perPage?: any;
  model?: any;
  login: any;
  multerErr?: any;
  file?: any;
  upload?: any;
  sharpSize?: any;
  sharpOption?: any;
}

export function success(res: any, message: string): any {
  return (data) => {
    const result = {
      type: 'success',
      message,
      data,
    };
    res.status(200)
      .json(result);
    return result;
  };
}

export function error(res: Response, code?: number, message?: string, description?: string): any {
  return (errorDetails) => {
    const result = {
      type: 'error',
      message: message || errorDetails.message,
      code: code || errorDetails.code,
      description: description || errorDetails.description || errorDetails.details || '',
      error: JSON.stringify(errorDetails),
    };
    res.status(code || errorDetails.code)
      .json(result);
    return result;
  };
}
