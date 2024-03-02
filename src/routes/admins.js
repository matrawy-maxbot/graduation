import express from 'express';
import {getAdmins, getAdmin, createAdmin, updateAdmin} from '../controllers/admins.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/', call(getAdmins));
router.get('/:id', call(getAdmin));
router.post('/', call(createAdmin));
router.patch('/:id', call(updateAdmin));

export default router;