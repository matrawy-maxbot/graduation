import express from 'express';
import { getAppointments, getUsersAppointments, getUserAppointments, getDoctorsAppointments, getDoctorAppointments, getPatientsAppointments, getPatientAppointments, createAppointment, deleteAppointment, checkAppointment, completeAppointment } from '../controllers/appointment.js';
import { checkRequired } from '../middleware/plugins.js';
import { checkDoctor } from '../controllers/doctors.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
import { checkDate } from '../database/tableSettings.js';
import { checkDateOnDoctor } from '../controllers/appointment.js';
const router = express.Router();
router.use(express.json());

router.get('/users/me', call(checkToken), call(checkRole, ["user", "unsystem"]), call(getUserAppointments));
router.get('/doctors/me', call(checkToken), call(checkRole, ["doctor", "unsystem"]), call(getDoctorAppointments));
router.get('/', call(checkToken), call(checkRole, "admin"), call(getAppointments));
router.get('/users', call(checkToken), call(checkRole, "admin"), call(getUsersAppointments));
router.get('/users/:id', call(checkToken), call(checkRole, "admin"), call(getUserAppointments));
router.get('/doctors', call(checkToken), call(checkRole, "admin"), call(getDoctorsAppointments));
router.get('/doctors/:id', call(checkToken), call(checkRole, "admin"), call(getDoctorAppointments));
router.get('/patients', call(checkToken), call(checkRole, "admin"), call(getPatientsAppointments));
router.get('/patients/:name', call(checkToken), call(checkRole, "admin"), call(getPatientAppointments));
router.post('/:id', call(checkToken), call(checkRole, ["user","unsystem"]), call(checkRequired, ['name', 'phone', 'age', 'sex', 'app_date']), call(checkDoctor), call((req, res, next) => {try{checkDate(req.body.app_date, req, res, next)} catch (err) { throw err; }}), call(checkDateOnDoctor), call(createAppointment));
router.post('/:id/completed', call(checkToken), call(checkRole, ["doctor","unsystem"]), call(checkAppointment), call(completeAppointment));
router.delete('/:id', call(checkToken), call(checkRole, "all"), call(checkAppointment), call(deleteAppointment));

export default router;