import express from 'express';
import {getReports, getUsersReports, getUserReports, getDoctorsReports, getDoctorReports, getPatientsReports, getPatientReports, createReport} from '../controllers/report.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/', call(getReports));
router.get('/users', call(getUsersReports));
router.get('/users/:id', call(getUserReports));
router.get('/doctors', call(getDoctorsReports));
router.get('/doctors/:id', call(getDoctorReports));
router.get('/patients', call(getPatientsReports));
router.get('/patients/:name', call(getPatientReports));
router.post('/', call(createReport));

export default router;