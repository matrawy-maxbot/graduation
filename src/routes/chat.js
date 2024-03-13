import express from 'express';
import { getChat, getChats, createMessage } from '../controllers/chat.js';
import { checkRequired } from '../middleware/plugins.js';
import { checkToken, checkRole } from '../middleware/authentication.js';
import fileUpload from 'express-fileupload';
import { call } from '../middleware/handleError.js';
const router = express.Router();
router.use(express.json());
router.use(fileUpload());

router.get('/', call(checkToken), call(checkRole, "admin"), call(getChats));
router.get('/:id', call(checkToken), call(checkRole, "all"), call(getChat));
router.post('/:id', call(checkToken), call(checkRole, ["all", "unsystem"]), (req,res,next) => { if(req.files) req.body.file = req.files.file;console.log("req body : ", req.body);next(); }, call(checkRequired, ['content||file']), call(createMessage));



export default router;