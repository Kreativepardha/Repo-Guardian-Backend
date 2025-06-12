import winston, { createLogger, format, transports, addColors } from 'winston'
import util from 'util'

// Define log level colors
const logColors = {
    error: 'red',
    warn: 'yellow',
    info: 'cyan',
    http: 'magenta',
    debug: 'blue'
}

// Apply colors to Winston
addColors(logColors)

// Custom console log format
const consoleLogFormat = format.printf(({ level, message, timestamp, meta = {}, ...rest }) => {
    const colorizer = winston.format.colorize()
    const safeTimestamp = typeof timestamp === 'string' ? timestamp : new Date().toISOString()
    const safeMessage = typeof message === 'string' ? message : util.inspect(message, { depth: null })
    
    // Combine meta and rest into a single metadata object
    const metadata = {
        ...meta,
        ...rest
    }
    
    const metaString = Object.keys(metadata).length 
        ? `\nMETA: ${util.inspect(metadata, { depth: null })}`
        : ''

    const logMessage = `${level.toUpperCase()} -- [${safeTimestamp}] ${safeMessage} ${metaString}\n`
    return colorizer.colorize(level, logMessage)
})

// Create the logger
const logger = createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.errors({ stack: true }),
        format.json()
    ),
    defaultMeta: { 
        service: 'repo-guardian',
        environment: process.env.NODE_ENV || 'development'
    },
    transports: [
        new transports.Console({
            format: format.combine(
                format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                consoleLogFormat
            )
        }),
        new transports.File({ 
            filename: 'logs/error.log', 
            level: 'error',
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        }),
        new transports.File({ 
            filename: 'logs/combined.log',
            format: format.combine(
                format.timestamp(),
                format.json()
            )
        })
    ]
})

// Add request context to logger
export const addRequestContext = (req: any) => {
    return {
        requestId: req.id,
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.get('user-agent')
    }
}

// Add scan context to logger
export const addScanContext = (scanId: number, toolName?: string) => {
    return {
        scanId,
        toolName,
        timestamp: new Date().toISOString()
    }
}

export default logger