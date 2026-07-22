
import { Router } from 'express';
import {
    scanDataSetController,
    getDatasetByIdController
} from '../controller/dataset.controller.js';

const router = Router();


router.get('/scan', scanDataSetController);

router.get('/:id', getDatasetByIdController);

export default router;