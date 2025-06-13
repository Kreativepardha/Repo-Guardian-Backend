import { runCommand } from "../utils/cliRunner"
import logger from "../utils/logger"

export async function runSemgrep(targetPath: string): Promise<any> {
  logger.info('Starting Semgrep scan', { targetPath });

  const cmd = `semgrep --config auto --json --quiet -o - ${targetPath}`
  logger.info('Executing Semgrep command', { cmd });

  try {
    const output = await runCommand(cmd)
    
    // Log raw output for debugging
    logger.debug('Semgrep raw output', { 
      outputLength: output.length,
      firstFewLines: output.split('\n').slice(0, 3).join('\n')
    });

    // Handle empty output
    if (!output.trim()) {
      logger.info('Semgrep returned empty output, no findings');
      return {
        findings: [],
        rawOutput: { results: [] }
      };
    }

    try {
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
    } catch (parseError) {
      logger.error('Failed to parse Semgrep output as JSON', {
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        outputPreview: output.substring(0, 200) // Log first 200 chars for debugging
      });
      throw new Error('Failed to parse Semgrep output as JSON');
    }
  } catch (error) {
    logger.error('Semgrep scan failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}
