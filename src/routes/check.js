import express from 'express';
import {checkPhoneAccount} from '../controllers/check.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { checkRequired } from '../middleware/plugins.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/', call(checkToken), call(checkRole, ["system"]), call(checkRequired, ['phone']), call(checkPhoneAccount));

export default router;