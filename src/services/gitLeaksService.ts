import { runCommand } from "../utils/cliRunner";
import logger from "../utils/logger";

export async function runGitleaks(targetPath: string): Promise<any> {
  logger.info('Starting Gitleaks scan', { targetPath });

  const cmd = `gitleaks detect --source=${targetPath} --report-format json`;
  logger.info('Executing Gitleaks command', { cmd });

  try {
    const output = await runCommand(cmd);
    
    // Log raw output for debugging
    logger.debug('Gitleaks raw output', {
      outputLength: output.length,
      firstFewLines: output.split('\n').slice(0, 3).join('\n')
    });

    // Handle empty output
    if (!output.trim()) {
      logger.info('Gitleaks returned empty output, no leaks found');
      return {
        leaks: [],
        rawOutput: []
      };
    }

    try {
      const parsed = JSON.parse(output);
      logger.info('Gitleaks results parsed', {
        leaksCount: parsed.length || 0,
        leakTypes: [...new Set(parsed.map((leak: any) => leak.rule))].join(', ')
      });

      return {
        leaks: parsed || [],
        rawOutput: parsed
      }
    } catch (parseError) {
      // If JSON parsing fails, check if it's a warning about leaks found
      if (output.includes('leaks found:')) {
        const leakCount = parseInt(output.match(/leaks found: (\d+)/)?.[1] || '0');
        logger.warn('Gitleaks found leaks but output format was not JSON', {
          leakCount,
          rawOutput: output
        });
        return {
          leaks: [],
          rawOutput: output,
          warning: `Found ${leakCount} leaks but could not parse details`
        };
      }

      logger.error('Failed to parse Gitleaks output as JSON', {
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        outputPreview: output.substring(0, 200)
      });
      throw new Error('Failed to parse Gitleaks output as JSON');
    }
  } catch (error) {
    logger.error('Gitleaks scan failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
}
