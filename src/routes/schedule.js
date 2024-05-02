import express from 'express';
import {getSchedules, getDoctorSchedules, createSchedules, updateSchedules} from '../controllers/schedule.js';
import { checkRequired } from '../middleware/plugins.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/me', call(checkToken), call(checkRole, ["doctor", "unsystem"]), call(getDoctorSchedules));
router.patch('/me', call(checkToken), call(checkRole, ["doctor", "unsystem"]), call(checkRequired, ['sunday||monday||tuesday||wednesday||thursday||friday||saturday']), call(updateSchedules));
router.get('/', call(checkToken), call(checkRole, "admin"), call(getSchedules));
router.get('/:id', call(checkToken), call(checkRole, "admin"), call(getDoctorSchedules));
router.post('/', call(checkToken), call(checkRole, "admin"), call(createSchedules));

export default router;