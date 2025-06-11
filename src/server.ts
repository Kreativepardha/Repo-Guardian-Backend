import app from './app.ts'
import logger from './utils/logger.ts';



const PORT = process.env.PORT || 4000;


app.listen(PORT, () => {
  logger.info(`Server started on http://localhost:${PORT}`)
})


