import express from 'express';
import {login} from '../controllers/login.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.post('/', call(login));

export default router;