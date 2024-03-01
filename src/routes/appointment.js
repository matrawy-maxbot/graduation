import express from 'express';
import {getAppointments, getUsersAppointments, getUserAppointments, getDoctorsAppointments, getDoctorAppointments, getPatientsAppointments, getPatientAppointments, createAppointment} from '../controllers/appointment.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/', call(getAppointments));
router.get('/users', call(getUsersAppointments));
router.get('/users/:id', call(getUserAppointments));
router.get('/doctors', call(getDoctorsAppointments));
router.get('/doctors/:id', call(getDoctorAppointments));
router.get('/patients', call(getPatientsAppointments));
router.get('/patients/:name', call(getPatientAppointments));
router.post('/', call(createAppointment));

export default router;