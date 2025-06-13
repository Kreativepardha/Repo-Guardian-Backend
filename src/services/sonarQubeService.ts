import { runCommand } from "../utils/cliRunner";
import logger from "../utils/logger";

export async function runSonarQube(targetPath: string): Promise<any> {
  logger.info('Starting SonarQube scan', { targetPath });

  // Generate a unique project key
  const projectKey = `scan-${Date.now()}`;
  
  const cmd = `sonar-scanner \
    -Dsonar.projectKey=${projectKey} \
    -Dsonar.sources=${targetPath} \
    -Dsonar.host.url=${process.env.SONAR_HOST_URL || 'http://localhost:9000'} \
    -Dsonar.login=${process.env.SONAR_TOKEN || ''} \
    -Dsonar.verbose=true \
    -Dsonar.analysis.mode=preview \
    -Dsonar.report.export.path=sonar-report.json`;

  logger.info('Executing SonarQube command', { cmd });

  try {
    const output = await runCommand(cmd);
    
    // Log raw output for debugging
    logger.debug('SonarQube raw output', {
      outputLength: output.length,
      firstFewLines: output.split('\n').slice(0, 3).join('\n')
    });

    // Try to read the report file
    try {
      const reportPath = `${targetPath}/sonar-report.json`;
      const reportContent = await runCommand(`cat ${reportPath}`);
      const parsed = JSON.parse(reportContent);
      
      logger.info('SonarQube results parsed', {
        issuesCount: parsed.issues?.length || 0,
        hotspotsCount: parsed.hotspots?.length || 0,
        metrics: parsed.metrics
      });

      return {
        issues: parsed.issues || [],
        hotspots: parsed.hotspots || [],
        metrics: parsed.metrics || {},
        rawOutput: parsed
      };
    } catch (parseError) {
      logger.error('Failed to parse SonarQube report', {
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        outputPreview: output.substring(0, 200)
      });
      throw new Error('Failed to parse SonarQube report');
    }
  } catch (error) {
    logger.error('SonarQube scan failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
} 