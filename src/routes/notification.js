import express from 'express';
import {getNotifications, createNotification} from '../controllers/notification.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/:id', call(getNotifications));
router.post('/:id', call(createNotification));

export default router;