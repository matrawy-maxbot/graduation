import express from 'express';
import {getAppointments, getUsersAppointments, getUserAppointments, getDoctorsAppointments, getDoctorAppointments, getPatientsAppointments, getPatientAppointments, createAppointment, deleteAppointment, checkAppointment} from '../controllers/appointment.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/users/me', call(checkToken), call(checkRole, "user"), call(getUserAppointments));
router.get('/doctors/me', call(checkToken), call(checkRole, "doctor"), call(getDoctorAppointments));
router.get('/', call(checkToken), call(checkRole, "admin"), call(getAppointments));
router.get('/users', call(checkToken), call(checkRole, "admin"), call(getUsersAppointments));
router.get('/users/:id', call(checkToken), call(checkRole, "admin"), call(getUserAppointments));
router.get('/doctors', call(checkToken), call(checkRole, "admin"), call(getDoctorsAppointments));
router.get('/doctors/:id', call(checkToken), call(checkRole, "admin"), call(getDoctorAppointments));
router.get('/patients', call(checkToken), call(checkRole, "admin"), call(getPatientsAppointments));
router.get('/patients/:name', call(checkToken), call(checkRole, "admin"), call(getPatientAppointments));
router.post('/:id', call(checkToken), call(checkRole, ["user","unsystem"]), call(createAppointment));
router.delete('/:id', call(checkToken), call(checkRole, "all"), call(checkAppointment), call(deleteAppointment));

export default router;