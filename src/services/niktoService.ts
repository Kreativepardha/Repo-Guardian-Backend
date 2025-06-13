import { runCommand } from "../utils/cliRunner";
import logger from "../utils/logger";

export async function runNikto(targetPath: string): Promise<any> {
  logger.info('Starting Nikto scan', { targetPath });

  // Extract the base URL from the repository
  const baseUrl = process.env.TARGET_URL || 'http://localhost:8080';
  const outputFile = `${targetPath}/nikto-report.json`;

  const cmd = `nikto -h ${baseUrl} -Format json -o ${outputFile}`;
  logger.info('Executing Nikto command', { cmd });

  try {
    const output = await runCommand(cmd);
    
    // Log raw output for debugging
    logger.debug('Nikto raw output', {
      outputLength: output.length,
      firstFewLines: output.split('\n').slice(0, 3).join('\n')
    });

    // Try to read the report file
    try {
      const reportContent = await runCommand(`cat ${outputFile}`);
      const parsed = JSON.parse(reportContent);
      
      logger.info('Nikto results parsed', {
        vulnerabilitiesCount: parsed.vulnerabilities?.length || 0,
        scanTime: parsed.scan_time,
        host: parsed.host
      });

      return {
        vulnerabilities: parsed.vulnerabilities || [],
        scanTime: parsed.scan_time,
        host: parsed.host,
        rawOutput: parsed
      };
    } catch (parseError) {
      logger.error('Failed to parse Nikto report', {
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        outputPreview: output.substring(0, 200)
      });
      throw new Error('Failed to parse Nikto report');
    }
  } catch (error) {
    logger.error('Nikto scan failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
} 