import express from 'express';
import {createRating} from '../controllers/ratings.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.post('/:id/:rating', call(createRating));

export default router;