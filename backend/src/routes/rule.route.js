import { Router } from 'express';
import { createRuleController } from '../controller/rule.controller.js';

const router = Router();

router.post('/batch', createRuleController);

export default router;