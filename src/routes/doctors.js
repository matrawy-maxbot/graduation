import express from 'express';
import {getDoctors, getDoctor, createDoctor} from '../controllers/doctors.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/', call(getDoctors));
router.get('/:id', call(getDoctor));
router.post('/', call(createDoctor));

export default router;