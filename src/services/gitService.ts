import { exec } from 'child_process'
import path from 'path'
import fs from 'fs/promises'
import logger from '../utils/logger'
import { error } from 'console'


const TMP_DIR = '/tmp/repo-scans'








export async function cloneRepo(repoUrl: string, scanId: number): Promise<string> {
  const targetDir = path.join(TMP_DIR, `scan-${scanId}`);

  try {
    await fs.rm(targetDir, { recursive: true, force: true });
    logger.info('Cleaned Old Scan directory', { scanId })
  } catch (err) {
    logger.warn(`Failed cleaning old directory`, {
      scanId,
      error: err
    })
  }

  await fs.mkdir(TMP_DIR, { recursive: true })

  const cloneCmd = `git clone --depth=1 ${repoUrl} ${targetDir}`;
  logger.info('Cloning repo', { repoUrl, scanId, cloneCmd })

  return new Promise((resolve, reject) => {
    exec(cloneCmd, (error, stdout, stderr) => {

      if (error) {
        logger.error('Git Clone failed', {
          repoUrl,
          scanId,
          error: error.message,
          stderr
        });

        return reject(new Error(`Git Clone failed: ${stderr}`))
      }

      logger.info('Git clone successfull', {
        scanId,
        repoUrl,
        stdout
      });
      resolve(targetDir);
    })
  })















}


