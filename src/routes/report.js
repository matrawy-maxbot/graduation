import express from 'express';
import {getReports, getUsersReports, getUserReports, getDoctorsReports, getDoctorReports, getPatientsReports, getPatientReports, createReport, checkReport, checkReportToDelete, deleteReport} from '../controllers/report.js';
import { checkRequired } from '../middleware/plugins.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/users/me', call(checkToken), call(checkRole, ["user", "unsystem"]), call(getUserReports));
router.get('/doctors/me', call(checkToken), call(checkRole, ["doctor", "unsystem"]), call(getDoctorReports));
router.get('/', call(checkToken), call(checkRole, "admin"), call(getReports));
router.get('/users', call(checkToken), call(checkRole, "admin"), call(getUsersReports));
router.get('/users/:id', call(checkToken), call(checkRole, "admin"), call(getUserReports));
router.get('/doctors', call(checkToken), call(checkRole, "admin"), call(getDoctorsReports));
router.get('/doctors/:id', call(checkToken), call(checkRole, "admin"), call(getDoctorReports));
router.get('/patients', call(checkToken), call(checkRole, "admin"), call(getPatientsReports));
router.get('/patients/:name', call(checkToken), call(checkRole, "admin"), call(getPatientReports));
router.post('/:id/:appId', call(checkToken), call(checkRole, ["doctor", "unsystem"]), call(checkRequired, ['diagnosis', 'medicines']), call(checkReport), call(createReport));
router.delete('/:id', call(checkToken), call(checkRole, ["doctor", "admin"]), call(checkReportToDelete), call(deleteReport));

export default router;