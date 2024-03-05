import express from 'express';
import {getAdmins, getAdmin, createAdmin, updateAdmin} from '../controllers/admins.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/me', call(checkToken), call(checkRole, "admin"), call(getAdmin));
router.patch('/me', call(checkToken), call(checkRole, "admin"), call(updateAdmin));
router.get('/', call(checkToken), call(checkRole, "admin"), call(getAdmins));
router.get('/:id', call(checkToken), call(checkRole, ["admin", "doctor"]), call(getAdmin));
router.post('/', call(checkToken), call(checkRole, "admin"), call(createAdmin));
router.patch('/:id', call(checkToken), call(checkRole, "admin"), call(updateAdmin));



export default router;