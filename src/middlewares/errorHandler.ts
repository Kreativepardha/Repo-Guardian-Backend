import logger from "../utils/logger";
import { Request, Response, NextFunction } from "express";




export function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  })
}



