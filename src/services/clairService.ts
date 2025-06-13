import { runCommand } from "../utils/cliRunner";
import logger from "../utils/logger";

export async function runClair(targetPath: string): Promise<any> {
  logger.info('Starting Clair scan', { targetPath });

  // Get the host IP from environment or use default
  const hostIP = process.env.CLAIR_HOST_IP || 'localhost';
  const reportFile = `${targetPath}/clair-report.json`;

  const cmd = `clair-scanner --ip ${hostIP} --report ${reportFile} ${targetPath}`;
  logger.info('Executing Clair command', { cmd });

  try {
    const output = await runCommand(cmd);
    
    // Log raw output for debugging
    logger.debug('Clair raw output', {
      outputLength: output.length,
      firstFewLines: output.split('\n').slice(0, 3).join('\n')
    });

    // Try to read the report file
    try {
      const reportContent = await runCommand(`cat ${reportFile}`);
      const parsed = JSON.parse(reportContent);
      
      logger.info('Clair results parsed', {
        vulnerabilitiesCount: parsed.vulnerabilities?.length || 0,
        layers: parsed.layers?.length || 0,
        scanTime: parsed.scan_time
      });

      return {
        vulnerabilities: parsed.vulnerabilities || [],
        layers: parsed.layers || [],
        scanTime: parsed.scan_time,
        rawOutput: parsed
      };
    } catch (parseError) {
      logger.error('Failed to parse Clair report', {
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        outputPreview: output.substring(0, 200)
      });
      throw new Error('Failed to parse Clair report');
    }
  } catch (error) {
    logger.error('Clair scan failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
} 