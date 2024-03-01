import express from 'express';
import {getUsers, getUser, createUser} from '../controllers/users.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/', call(getUsers));
router.get('/:id', call(getUser));
router.post('/', call(createUser));

export default router;




/*

    INSERT INTO `appointments` (`id`, `name`, `phone`, `age`, `sex`, `city`, `description`,
    `photos`, `owner_id`, `doctor_id`, `department`, `created_at`) VALUES ('1a2b3c', 'Patient Name',
    '+00123456789', '30', '0', 'Cityville', 'Patient\'s description goes here.', 
    '[\"https://example.com/photo1.jpg\", \"https://example.com/photo2.jpg\"]', 'owner123',
    'doc456', '0', current_timestamp()),
    ('4d5e6f', 'Patient2 Name', '+00987654321', '45', '1', 'Townsville',
    'Patient\'s additional description.', '\"https://example.com/photo3.jpg\"', 'owner456',
    'doc789', '1', current_timestamp());
*/