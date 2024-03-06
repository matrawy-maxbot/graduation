import express from 'express';
import {createRating, updateRating} from '../controllers/ratings.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.post('/:id/:rating', call(checkToken), call(checkRole, ["user", "unsystem"]), call(createRating));
router.put('/:id/:rating', call(checkToken), call(checkRole, ["user", "unsystem"]), call(updateRating));

export default router;