import express from 'express';
import { getChat, getChats, createMessage } from '../controllers/chat.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/', call(checkToken), call(checkRole, "admin"), call(getChats));
router.get('/:id', call(checkToken), call(checkRole, "all"), call(getChat));
router.post('/:id', call(checkToken), call(checkRole, ["all", "unsystem"]), call(createMessage));

export default router;