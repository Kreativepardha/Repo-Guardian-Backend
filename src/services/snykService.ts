import { runCommand } from "../utils/cliRunner";
import logger from "../utils/logger";

export async function runSnyk(targetPath: string): Promise<any> {
  logger.info('Starting Snyk scan', { targetPath });

  const cmd = `snyk test --json --all-projects`;
  logger.info('Executing Snyk command', { cmd });

  try {
    const output = await runCommand(cmd);
    
    // Log raw output for debugging
    logger.debug('Snyk raw output', {
      outputLength: output.length,
      firstFewLines: output.split('\n').slice(0, 3).join('\n')
    });

    try {
      const parsed = JSON.parse(output);
      
      logger.info('Snyk results parsed', {
        vulnerabilitiesCount: parsed.vulnerabilities?.length || 0,
        dependencyCount: parsed.dependencyCount,
        projects: parsed.projects?.length || 0
      });

      return {
        vulnerabilities: parsed.vulnerabilities || [],
        dependencies: parsed.dependencies || [],
        projects: parsed.projects || [],
        rawOutput: parsed
      };
    } catch (parseError) {
      logger.error('Failed to parse Snyk output', {
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        outputPreview: output.substring(0, 200)
      });
      throw new Error('Failed to parse Snyk output');
    }
  } catch (error) {
    logger.error('Snyk scan failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
} 