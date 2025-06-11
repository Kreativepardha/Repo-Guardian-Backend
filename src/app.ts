import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import rateLimit from 'express-rate-limit'


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

app.use()

app.use()

export default app;

