import type { Request, Response, NextFunction } from "express";
import Prisma from "../config/client";
import logger, { addScanContext } from "../utils/logger";
import { startScanSchema } from "../validations/scanSchema";
import { error } from "winston";
import { cloneRepo } from "../services/gitService";
import { runFullScan } from "../runners/scanRunner";

export async function startScan(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = startScanSchema.safeParse(req.body);
    if (!parsed.success) {
      logger.warn('Invalid scan request', {
        errors: parsed.error.flatten(),
        body: req.body
      });
      return res.status(400).json({
        error: 'Invalid input',
        details: parsed.error.flatten(),
      })
    }

    const { repoUrl } = parsed.data;

    const scan = await Prisma.scan.create({
      data: {
        repoUrl,
        status: 'CLONING',
      }
    })

    logger.info('New scan initiated', {
      ...addScanContext(scan.id),
      repoUrl
    })

    const localPath = await cloneRepo(repoUrl, scan.id)

    // Start the scan process
    runFullScan(scan.id, localPath)
    
    await Prisma.scan.update({
      where: { id: scan.id },
      data: { status: 'RUNNING' },
    })

    logger.info('Scan process started', {
      ...addScanContext(scan.id),
      localPath
    })

    res.status(201).json({
      scanId: scan.id,
      repoUrl,
      status: 'RUNNING',
      path: localPath
    });

  } catch (err) {
    logger.error('Scan initiation failed', {
      error: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
      body: req.body
    });
    next(err);
  }
}

export async function getScanResults(req: Request, res: Response, next: NextFunction) {
  const scanId = parseInt(req.params.id);

  if (isNaN(scanId)) return res.status(400).json({
    error: 'Invalid scan ID'
  })

  try {
    const scan = await Prisma.scan.findUnique({
      where: { id: scanId },
      include: {
        toolRuns: true,
      }
    })

    if (!scan) return res.status(404).json({
      error: 'Scan not found'
    })

    res.json(scan);
  } catch (err) {
    next(err);
  }
}

export async function listAllScan(req: Request, res: Response, next: NextFunction) {
  try {
    const scans = await Prisma.scan.findMany({
      orderBy: { createdAt: 'desc' },
      include: { toolRuns: true },
    });

    res.json(scans)
  } catch (err) {
    next(err);
  }
}















