import type { Request, Response, NextFunction } from "express";
import logger, { addRequestContext } from "../utils/logger";

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  // Add start time to request
  (req as any).startTime = Date.now();
  
  const requestContext = addRequestContext(req);
  
  logger.info(`${req.method} ${req.url}`, requestContext);
  
  // Log response
  const originalSend = res.send;
  res.send = function (body) {
    logger.info(`Response ${res.statusCode}`, {
      ...requestContext,
      statusCode: res.statusCode,
      responseTime: Date.now() - (req as any).startTime
    });
    return originalSend.call(this, body);
  };
  
  next();
}

export default loggerMiddleware;
