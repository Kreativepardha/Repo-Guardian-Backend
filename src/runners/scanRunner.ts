import { runSemgrep } from "../services/semgrepService";
import { runTrivy } from "../services/trivyService";
import Prisma from "../config/client";
import logger from "../utils/logger";
import { runGitleaks } from "../services/gitLeaksService";
import { error } from "winston";
import { summarizeWithAI } from "../services/aiService";

interface ToolRunConfig {
  name: string;
  runFn: (targetPath: string) => Promise<any>
}


const tools: ToolRunConfig[] = [
  { name: 'semgrep', runFn: runSemgrep },
  { name: 'gitleaks', runFn: runGitleaks },
  { name: 'trivy', runFn: runTrivy },
];

export async function runFullScan(scanId: number, localPath: string) {
  logger.info("Starting FullScan", { scanId, localPath });

  try {
    for (const tool of tools) {
      logger.info(`Starting tool: ${tool.name}`, { scanId })

      const toolRun = await Prisma.toolRun.create({
        data: {
          scanId,
          toolName: tool.name,
          status: 'RUNNING'
        }
      });

      logger.info('ToolRun Record Created', { 
        scanId,
        toolRunId: toolRun.id,
        tool: tool.name
      })


      try {
        const rawResult = await tool.runFn(localPath)

        logger.info('Tool Execution Completed', {
          scanId,
          toolRunId: toolRun.id,
          tool: tool.name,
          resultSize: JSON.stringify(rawResult).length
        })
        const aiSummary = await summarizeWithAI(tool.name, rawResult);

        logger.info('Ai Summary Generated', {
          scanId,
          toolRunId: toolRun.id,
          tool: tool.name,
          summarySize: JSON.stringify(aiSummary).length
        })

        await Prisma.toolRun.update({
          where: { id: toolRun.id },
          data: {
            status: 'COMPLETED',
            output: {
              raw: rawResult,
              aiSummary,
            }
          }
        });

        logger.info(`ToolRun ${tool.name} COMPLETED`, {
          scanId,
          toolRunId: toolRun.id,
        });

      } catch (err) {
        logger.error(`Tool ${tool.name} failed`, {
          scanId,
          toolRunId: toolRun.id,
          error:  err instanceof Error ? err.message : String(err),
        });

        await Prisma.toolRun.update({
          where: { id: toolRun.id },
          data: {
            status: 'FAILED',
            output: {
              error: err instanceof Error ? err.message : 'Unknown Error',
              stack: err instanceof Error ? err.stack : undefined,
            },
          }
        })
      }
    }



    await Prisma.scan.update({
      where: { id: scanId },
      data: { status: 'COMPLETED' }
    });
    logger.info('Scan COMPLETED successfully', { scanId });
  } catch (err) {
    logger.error('scan runner failed', {
      scanId, error: err
    })

    await Prisma.scan.update({
      where: { id: scanId },
      data: { status: 'FAILED' },
    })
  }
}


