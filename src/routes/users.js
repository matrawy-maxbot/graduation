import express from 'express';
import getUsers from '../controllers/users.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();

router.get('/', call(getUsers));

export default router;