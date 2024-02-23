import express from 'express';
import getIndex from '../controllers/index.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();

router.get('/', call(getIndex));

export default router;