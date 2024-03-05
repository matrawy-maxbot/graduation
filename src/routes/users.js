import express from 'express';
import {getUsers, getUser, createUser, updateUser, deleteUser} from '../controllers/users.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());

router.get('/me', call(checkToken), call(checkRole, "user"), call(getUser));
router.patch('/me', call(checkToken), call(checkRole, "user"), call(updateUser));
router.delete('/me', call(checkToken), call(checkRole, "user"), call(deleteUser));
router.get('/', call(checkToken), call(checkRole, "admin"), call(getUsers));
router.get('/:id', call(checkToken), call(checkRole, "all"), call(getUser));
router.post('/', call(checkToken), call(checkRole, "admin"), call(createUser));
router.patch('/:id', call(checkToken), call(checkRole, "admin"), call(updateUser));
router.delete('/', call(checkToken), call(checkRole, "admin"), call(deleteUser));
router.delete('/:id', call(checkToken), call(checkRole, "admin"), call(deleteUser));

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