import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'
import loggerMiddleware from './middlewares/loggerMiddleware'
import scanRoutes from './routes/scanRoutes'
import { errorHandler } from './middlewares/errorHandler'

const app = express()

app.use(helmet())
app.use(cors())
app.use(express.json())

app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 60,
  })
);

app.use(loggerMiddleware)

app.use('/api/scan', scanRoutes);

app.use(errorHandler)

export default app;

