import express from 'express';
import {createRating, updateRating} from '../controllers/ratings.js';
import { checkRequired } from '../middleware/plugins.js';
import { checkDoctor } from '../controllers/doctors.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.post('/:id/:rating', call(checkToken), call(checkRole, ["user", "unsystem"]), call(checkRequired, ['rating']), call(checkDoctor), call(createRating));
router.put('/:id/:rating', call(checkToken), call(checkRole, ["user", "unsystem"]), call(checkRequired, ['rating']), call(checkDoctor), call(updateRating));

export default router;