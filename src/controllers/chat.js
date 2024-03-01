import { sendError } from '../middleware/error.js';
import { DBselect, DBinsert } from '../database/index.js';

const getChat = async ( req, res, next) => {
    
    const id = "user789";
    const chat = await DBselect('chat', '*', "source = '" + id + "' OR destination = '" + id + "'");
    res.json(chat);

};

const createMessage = async ( req, res, next) => {

    console.log(req.body);
    const id = "user789";
    req.body.source = id;
    const appointment = await DBinsert('chat', req.body);
    res.json(appointment);

};
  
export {getChat, createMessage};