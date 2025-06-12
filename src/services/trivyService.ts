import { runCommand } from "../utils/cliRunner";
import logger from "../utils/logger";

export async function runTrivy(targetPath: string): Promise<any> {
  logger.info('Starting Trivy scan', { targetPath });

  const cmd = `trivy fs --quiet --format json ${targetPath}`;
  logger.info('Executing Trivy command', { cmd });

  try {
    const output = await runCommand(cmd);
    logger.info('Trivy command executed successfully', {
      outputLength: output.length,
      firstFewLines: output.split('\n').slice(0, 3).join('\n')
    });

    const parsed = JSON.parse(output);
    logger.info('Trivy results parsed', {
      resultsCount: parsed.Results?.length || 0,
      vulnerabilities: parsed.Results?.reduce((acc: number, curr: any) => 
        acc + (curr.Vulnerabilities?.length || 0), 0) || 0
    });

    return {
      vulns: parsed.Results || [],
      rawOutput: parsed,
    }
  } catch (error) {
    logger.error('Trivy scan failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}

