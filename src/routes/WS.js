import express from 'express';
import { sendWS } from '../controllers/WS.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.post('/', call(sendWS));

export default router;