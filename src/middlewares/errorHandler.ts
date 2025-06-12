import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";




export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error('Unhadnled Error::', err);

  res.status(err.status || 500).json({
    message: err.message || 'InternalSeverError'
  })

}



