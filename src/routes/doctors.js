import express from 'express';
import {getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor} from '../controllers/doctors.js';
import { checkRequired, checkUnique } from '../middleware/plugins.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import fileUpload from 'express-fileupload';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());
router.use(fileUpload());

router.get('/me', call(checkToken), call(checkRole, "doctor"), call(getDoctor));
router.patch('/me', call(checkToken), call(checkRole, "doctor"), (req,res,next) => { if(req.files) req.body.avatar = req.files.avatar;next(); }, call(checkRequired, ['name||avatar||speciality||expertment']), call(updateDoctor));
router.get('/', call(checkToken), call(checkRole, "admin"), call(getDoctors));
router.get('/:id', call(checkToken), call(checkRole, "all"), call(getDoctor));
router.post('/', call(checkToken), call(checkRole, "admin"), call(checkRequired, ['name', 'phone', 'pass', 'speciality', 'expertment']), call(checkUnique, ["admins", "users", "doctors"], "phone"), call(createDoctor));
router.patch('/:id', call(checkToken), call(checkRole, "admin"), (req,res,next) => { if(req.files) req.body.avatar = req.files.avatar;next(); }, call(checkRequired, ['name||avatar||speciality||expertment']), call(updateDoctor));
//router.delete('/', call(checkToken), call(checkRole, "admin"), call(deleteDoctor));
router.delete('/:id', call(checkToken), call(checkRole, "admin"), call(deleteDoctor));

export default router;