import express from 'express';
import { getAvatars, getFiles } from '../controllers/files.js';
import { call } from '../middleware/handleError.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
const router = express.Router();
router.use(express.json());

router.get('/avatars', call(checkToken), call(checkRole, "admin"), call(getAvatars));
router.get('/chat', call(checkToken), call(checkRole, "admin"), call(getFiles));

export default router;