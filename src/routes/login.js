import express from 'express';
import {login} from '../controllers/login.js';
import { checkRequired } from '../middleware/plugins.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.post('/', call(checkRequired, ['phone', 'pass||password']), call(login));

export default router;