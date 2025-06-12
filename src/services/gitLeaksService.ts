import { runCommand } from "../utils/cliRunner";
import logger from "../utils/logger";

export async function runGitleaks(targetPath: string): Promise<any> {
  logger.info('Starting Gitleaks scan', { targetPath });

  const cmd = `gitleaks detect --source=${targetPath} --report-format json`;
  logger.info('Executing Gitleaks command', { cmd });

  try {
    const output = await runCommand(cmd);
    logger.info('Gitleaks command executed successfully', {
      outputLength: output.length,
      firstFewLines: output.split('\n').slice(0, 3).join('\n')
    });

    const parsed = JSON.parse(output);
    logger.info('Gitleaks results parsed', {
      leaksCount: parsed.length || 0,
      leakTypes: [...new Set(parsed.map((leak: any) => leak.rule))].join(', ')
    });

    return {
      leaks: parsed || [],
      rawOutput: parsed
    }
  } catch (error) {
    logger.error('Gitleaks scan failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}
