import express from 'express';
import {getSchedules, getDoctorSchedules, createSchedules} from '../controllers/schedule.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/', call(getSchedules));
router.get('/:id', call(getDoctorSchedules));
router.post('/', call(createSchedules));

export default router;