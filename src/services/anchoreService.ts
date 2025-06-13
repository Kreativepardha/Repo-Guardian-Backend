import { runCommand } from "../utils/cliRunner";
import logger from "../utils/logger";

export async function runAnchore(targetPath: string): Promise<any> {
  logger.info('Starting Anchore scan', { targetPath });

  // Get the Anchore engine URL from environment or use default
  const engineUrl = process.env.ANCHORE_ENGINE_URL || 'http://localhost:8228';
  const reportFile = `${targetPath}/anchore-report.json`;

  // First, analyze the image
  const analyzeCmd = `anchore-cli image add ${targetPath}`;
  logger.info('Executing Anchore analyze command', { cmd: analyzeCmd });

  try {
    const analyzeOutput = await runCommand(analyzeCmd);
    logger.debug('Anchore analyze output', {
      outputLength: analyzeOutput.length,
      firstFewLines: analyzeOutput.split('\n').slice(0, 3).join('\n')
    });

    // Wait for analysis to complete
    const waitCmd = `anchore-cli image wait ${targetPath}`;
    await runCommand(waitCmd);

    // Get the evaluation results
    const evalCmd = `anchore-cli evaluate check ${targetPath} --detail --json > ${reportFile}`;
    logger.info('Executing Anchore evaluation command', { cmd: evalCmd });
    
    const evalOutput = await runCommand(evalCmd);
    
    // Try to read and parse the report file
    try {
      const reportContent = await runCommand(`cat ${reportFile}`);
      const parsed = JSON.parse(reportContent);
      
      logger.info('Anchore results parsed', {
        vulnerabilitiesCount: parsed.vulnerabilities?.length || 0,
        policyChecks: parsed.policy_checks?.length || 0,
        imageDigest: parsed.image_digest
      });

      return {
        vulnerabilities: parsed.vulnerabilities || [],
        policyChecks: parsed.policy_checks || [],
        imageDigest: parsed.image_digest,
        rawOutput: parsed
      };
    } catch (parseError) {
      logger.error('Failed to parse Anchore report', {
        error: parseError instanceof Error ? parseError.message : 'Unknown error',
        outputPreview: evalOutput.substring(0, 200)
      });
      throw new Error('Failed to parse Anchore report');
    }
  } catch (error) {
    logger.error('Anchore scan failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
} 