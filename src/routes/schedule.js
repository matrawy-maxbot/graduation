import express from 'express';
import {getSchedules, getDoctorSchedules, createSchedules, updateSchedules} from '../controllers/schedule.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/me', call(checkToken), call(checkRole, "doctor"), call(getDoctorSchedules));
router.patch('/me', call(checkToken), call(checkRole, "doctor"), call(updateSchedules));
router.get('/', call(checkToken), call(checkRole, "admin"), call(getSchedules));
router.get('/:id', call(checkToken), call(checkRole, "admin"), call(getDoctorSchedules));
router.post('/', call(checkToken), call(checkRole, "admin"), call(createSchedules));

export default router;