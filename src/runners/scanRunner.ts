import { runSemgrep } from '../services/semgrepService';
import { runTrivy } from '../services/trivyService';
import { runGitleaks } from '../services/gitLeaksService';
import { runSonarQube } from '../services/sonarQubeService';
import { runNikto } from '../services/niktoService';
import { runSnyk } from '../services/snykService';
import { runClair } from '../services/clairService';
import { runAnchore } from '../services/anchoreService';
import { analyzeVulnerability } from '../services/aiService';
import logger from '../utils/logger';
import Prisma from '../config/client';

interface ToolRunConfig {
  name: string;
  runFn: (targetPath: string) => Promise<any>;
  description: string;
}

const tools: ToolRunConfig[] = [
  {
    name: 'semgrep',
    runFn: runSemgrep,
    description: 'Static Analysis Security Testing (SAST)'
  },
  {
    name: 'gitleaks',
    runFn: runGitleaks,
    description: 'Secret Scanning'
  },
  {
    name: 'trivy',
    runFn: runTrivy,
    description: 'Vulnerability Scanner'
  },
  {
    name: 'sonarqube',
    runFn: runSonarQube,
    description: 'Code Quality and Security Analysis'
  },
  {
    name: 'nikto',
    runFn: runNikto,
    description: 'Web Server Scanner'
  },
  {
    name: 'snyk',
    runFn: runSnyk,
    description: 'Dependency and Container Scanning'
  },
  {
    name: 'clair',
    runFn: runClair,
    description: 'Container Image Analysis'
  },
  {
    name: 'anchore',
    runFn: runAnchore,
    description: 'Container Security Analysis'
  }
];

export async function runFullScan(id: number, targetPath: string): Promise<void> {
  logger.info('Starting full security scan', { targetPath });

  // Create scan record
  const scan = await Prisma.scan.create({
    data: {
      repoUrl: targetPath,
      status: 'RUNNING'
    }
  });

  try {
    for (const tool of tools) {
      logger.info(`Running ${tool.name} scan`, { description: tool.description });
      
      // Create tool run record
      const toolRun = await Prisma.toolRun.create({
        data: {
          scanId: scan.id,
          toolName: tool.name,
          status: 'RUNNING'
        }
      });

      try {
        // Execute tool
        const rawResults = await tool.runFn(targetPath);
        
        // Get AI analysis
        const analysis = await analyzeVulnerability(tool.name, rawResults);
        logger.info(`AI analysis completed for ${tool.name}`, {
          analysisSize: JSON.stringify(analysis).length
        });

        // Update tool run record
        await Prisma.toolRun.update({
          where: { id: toolRun.id },
          data: {
            status: 'COMPLETED',
            output: {
              raw: rawResults,
              analysis: analysis
            }
          }
        });

      } catch (error) {
        logger.error(`Tool ${tool.name} failed`, {
          error: error instanceof Error ? error.message : 'Unknown error',
          stack: error instanceof Error ? error.stack : undefined
        });

        // Update tool run record with error
        await Prisma.toolRun.update({
          where: { id: toolRun.id },
          data: {
            status: 'FAILED',
            output: {
              error: error instanceof Error ? error.message : 'Unknown error',
              stack: error instanceof Error ? error.stack : undefined
            }
          }
        });
      }
    }

    // Update scan status to completed
    await Prisma.scan.update({
      where: { id: scan.id },
      data: {
        status: 'COMPLETED'
      }
    });

  } catch (error) {
    logger.error('Full scan failed', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });

    // Update scan status to failed
    await Prisma.scan.update({
      where: { id: scan.id },
      data: {
        status: 'FAILED'
      }
    });

    throw error;
  }
}


