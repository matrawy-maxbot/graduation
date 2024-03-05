import { sendError } from '../middleware/error.js';
import { generateId } from '../middleware/id.js';
import { DBselect, DBinsert } from '../database/index.js';

const getChats = async ( req, res, next) => {
    
    const chat = await DBselect('chat', '*');
    res.json(chat);

};

const getChat = async ( req, res, next) => {
    
    const senderChat = await DBselect('chat', '*', "source = '" + req.owner.id + "' AND destination = '" + req.params.id + "'");
    const receiverChat = await DBselect('chat', '*', "source = '" + req.params.id + "' AND destination = '" + req.owner.id + "'");
    const chat = senderChat.concat(receiverChat);
    res.json(chat);

};

const createMessage = async ( req, res, next) => {

    console.log(req.body);
    req.body.id = generateId();
    const id = "user789";
    req.body.source = id;
    const appointment = await DBinsert('chat', req.body);
    res.json(appointment);

};
  
export {getChat, getChats, createMessage};