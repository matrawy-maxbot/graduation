import express from 'express';
import {getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor} from '../controllers/doctors.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/', call(getDoctors));
router.get('/:id', call(getDoctor));
router.post('/', call(createDoctor));
router.patch('/:id', call(updateDoctor));
router.delete('/', call(deleteDoctor));
router.delete('/:id', call(deleteDoctor));

export default router;