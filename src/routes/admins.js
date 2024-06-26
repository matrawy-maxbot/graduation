import express from 'express';
import {getAdmins, getAdmin, createAdmin, updateAdmin, deleteAdmin} from '../controllers/admins.js';
import { checkRequired, checkUnique } from '../middleware/plugins.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import fileUpload from 'express-fileupload';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());
router.use(fileUpload());

router.get('/me', call(checkToken), call(checkRole, ["admin", "unsystem"]), call(getAdmin));
router.patch('/me', call(checkToken), call(checkRole, ["admin", "unsystem"]), (req,res,next) => { if(req.files) req.body.avatar = req.files.avatar;next(); }, call(checkRequired, ['name||avatar']), call(updateAdmin));
router.get('/', call(checkToken), call(checkRole, "admin"), call(getAdmins));
router.get('/:id', call(checkToken), call(checkRole, ["admin", "doctor"]), call(getAdmin));
router.post('/', call(checkToken), call(checkRole, "admin"), call(checkRequired, ['name', 'phone', 'pass']), call(checkUnique, ["admins", "users", "doctors"], "phone"), call(createAdmin));
router.patch('/:id', call(checkToken), call(checkRole, "admin"), (req,res,next) => { if(req.files) req.body.avatar = req.files.avatar;next(); }, call(checkRequired, ['name||avatar']), call(updateAdmin));
router.delete('/me', call(checkToken), call(checkRole, ["admin", "unsystem"]), call(deleteAdmin));

export default router;