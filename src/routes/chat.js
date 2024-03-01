import express from 'express';
import {getChat, createMessage} from '../controllers/chat.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/', call(getChat));
router.post('/:id', call(createMessage));

export default router;