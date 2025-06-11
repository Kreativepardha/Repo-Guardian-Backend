import { Request, Response, NextFunction } from "express";
import Prisma from "../config/client";
import logger from "../utils/logger";
import { startScanSchema } from "../validations/scanSchema";
import { error } from "winston";
import { cloneRepo } from "../services/gitService";






export async function startScan(req: Request, res: Response, next: NextFunction) {
  try {
    const parsed = startScanSchema.safeParse(req.body);
    if (!parsed.success) {
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

    logger.info('New scan Created', {
      scanId: scan.id,
      repoUrl
    })

    const localPath = await cloneRepo(repoUrl, scan.id)

    // TODO: : Proceed to run security tools and save results

    await Prisma.scan.update({
      where: { id: scan.id },
      data: { status: 'RUNNING' },
    })

    res.status(201).json({
      scanId: scan.id,
      repoUrl,
      status: 'RUNNING',
      path: localPath
    });

  } catch (err) {
    next(err);
  }
}
