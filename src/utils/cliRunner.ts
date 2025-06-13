import { exec } from 'child_process'
import logger from './logger'



export function runCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 500 }, (error, stdout, stderr) => {
      if(error) {
        return reject(new Error(stderr || error.message ))
        
      }
      logger.info(`CMD:::`, {
        stdout
      })
      resolve(stdout)
    })
  })
}