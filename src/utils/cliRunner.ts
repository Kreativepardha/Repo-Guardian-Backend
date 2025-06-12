import { exec } from 'child_process'



export function runCommand(cmd: string): Promise<string> {
  return new Promise((resolve, reject) => {
    exec(cmd, { maxBuffer: 1024 * 1024 * 10 }, (error, stdout, stderr) => {
      if(error) {
        return reject(new Error(stderr || error.message ))
      }
      resolve(stdout)
    })
  })
}