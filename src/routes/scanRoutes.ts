import { Router } from 'express'
import { startScan, getScanResults, listAllScan } from '../controllers/scanController';


const router = Router()


router.post('/', startScan)
router.get('/', listAllScan)
router.get('/:id/results', getScanResults)


export default router;
