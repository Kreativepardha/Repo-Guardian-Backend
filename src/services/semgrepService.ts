import { runCommand } from "../utils/cliRunner"
import logger from "../utils/logger"

export async function runSemgrep(targetPath: string): Promise<any> {
  logger.info('Starting Semgrep scan', { targetPath });

  const cmd = `semgrep --config auto --json --quiet -o - ${targetPath}`
  logger.info('Executing Semgrep command', { cmd });

  try {
    const output = await runCommand(cmd)
    logger.info('Semgrep command executed successfully', { 
      firstFewLines: output.split('\n').slice(0, 3).join('\n')
    });

    const parsed = JSON.parse(output);
    logger.info('Semgrep results parsed', { 
      findingsCount: parsed.results?.length || 0,
      scanTime: parsed.time,
      errors: parsed.errors
    });

    return {
      findings: parsed.results || [],
      rawOutput: parsed,
    }
  } catch (error) {
    logger.error('Semgrep scan failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}
