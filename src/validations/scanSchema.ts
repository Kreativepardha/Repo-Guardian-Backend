import { z } from 'zod';



export const startScanSchema = z.object({
  repoUrl: z.string().url().regex(/^https:\/\/github\.com\/.+\/.+$/, {
    message: 'Only Github repo URLs are allowed'
  })
})









