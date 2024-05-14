import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export default function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
  if (err.status) {
    console.log(err)
    return res
      .status(err.status)
      .json({ message: err.message, 
        ok: false });
  }

  console.log(err)
  return res
    .status(StatusCodes.INTERNAL_SERVER_ERROR)
    .json({ message: 'Internal server error', 
    ok: false });
};
