import express from 'express';
import {createRating, updateRating} from '../controllers/ratings.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.post('/:id/:rating', call(createRating));
router.put('/:id/:rating', call(updateRating));

export default router;