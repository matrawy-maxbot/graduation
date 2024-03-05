import express from 'express';
import {getReports, getUsersReports, getUserReports, getDoctorsReports, getDoctorReports, getPatientsReports, getPatientReports, createReport, checkReport} from '../controllers/report.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/users/me', call(checkToken), call(checkRole, "user"), call(getUserReports));
router.get('/doctors/me', call(checkToken), call(checkRole, "doctor"), call(getDoctorReports));
router.get('/', call(checkToken), call(checkRole, "admin"), call(getReports));
router.get('/users', call(checkToken), call(checkRole, "admin"), call(getUsersReports));
router.get('/users/:id', call(checkToken), call(checkRole, "admin"), call(getUserReports));
router.get('/doctors', call(checkToken), call(checkRole, "admin"), call(getDoctorsReports));
router.get('/doctors/:id', call(checkToken), call(checkRole, "admin"), call(getDoctorReports));
router.get('/patients', call(checkToken), call(checkRole, "admin"), call(getPatientsReports));
router.get('/patients/:name', call(checkToken), call(checkRole, "admin"), call(getPatientReports));
router.post('/:id/:appId', call(checkToken), call(checkRole, "doctor"), call(checkReport), call(createReport));

export default router;