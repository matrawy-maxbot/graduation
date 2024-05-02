import express from 'express';
import { resetPassword, forgetPassword } from '../controllers/password.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { checkRequired } from '../middleware/plugins.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.post('/reset', call(checkToken), call(checkRole, ["all", "unsystem"]), call(checkRequired, ['oldpassword', 'newpassword']), call(resetPassword));
router.post('/forget/:id', call(checkToken), call(checkRole, ["system"]), call(checkRequired, ['newpassword']), call(forgetPassword));

export default router;