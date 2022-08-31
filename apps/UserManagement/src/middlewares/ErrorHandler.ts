import { Middleware, ExpressErrorMiddlewareInterface } from 'routing-controllers';
import { Request, Response, NextFunction } from 'express';
import { ServiceError } from '../common/errors';

@Middleware({ type: 'after' })
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  error(error: any, request: Request, response: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      response.status(error.error.statusCode).send(error.error.message);
    } else {
      let errorMessage = '';
      if (error.name === 'BadRequestError') {
        error.errors.map((valError) => {
          for (const key of Object.keys(valError.constraints)) {
            errorMessage += `${valError.property}: ${valError.constraints[key]},`;
          }
        });
      }
      response.status(400).send(errorMessage !== '' ? errorMessage : error.message);
    }
  }
}
