import express from 'express';
import {getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor} from '../controllers/doctors.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/me', call(checkToken), call(checkRole, "doctor"), call(getDoctor));
router.patch('/me', call(checkToken), call(checkRole, "doctor"), call(updateDoctor));
router.get('/', call(checkToken), call(checkRole, "admin"), call(getDoctors));
router.get('/:id', call(checkToken), call(checkRole, "all"), call(getDoctor));
router.post('/', call(checkToken), call(checkRole, "admin"), call(createDoctor));
router.patch('/:id', call(checkToken), call(checkRole, "admin"), call(updateDoctor));
//router.delete('/', call(checkToken), call(checkRole, "admin"), call(deleteDoctor));
router.delete('/:id', call(checkToken), call(checkRole, "admin"), call(deleteDoctor));

export default router;