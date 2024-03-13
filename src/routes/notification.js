import express from 'express';
import {getNotifications, createNotification} from '../controllers/notification.js';
import { checkRequired } from '../middleware/plugins.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/me', call(checkToken), call(checkRole, "all"), call(getNotifications));
router.get('/:id', call(checkToken), call(checkRole, "admin"), call(getNotifications));
router.post('/:id', call(checkToken), call(checkRole, "admin"), call(checkRequired, ['content']), call(createNotification));

export default router;