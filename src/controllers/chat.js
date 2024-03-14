import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { generateId, generateFileName } from '../middleware/id.js';
import { DBselect, DBinsert, uploadFile } from '../database/index.js';
import { event, sendEvent } from '../socket/events.js';
import { checkLogin } from './login.js';

const getChats = async ( req, res, next) => {
    
    const chat = await DBselect('chat', '*').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!chat) return;
    send(200, res, "success", chat);

};

const getChat = async ( req, res, next) => {
    
    const senderChat = await DBselect('chat', '*', "source = '" + req.owner.id + "' AND destination = '" + req.params.id + "'").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!senderChat) return;
    const receiverChat = await DBselect('chat', '*', "source = '" + req.params.id + "' AND destination = '" + req.owner.id + "'").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!receiverChat) return;
    const chat = senderChat.concat(receiverChat);
    send(200, res, "success", chat);

};

const createMessage = async ( req, res, next) => {

    //console.log(req.body);
    let checkID = await checkLogin(req.params.id, "id");
    if(!checkID) {
        sendError({status:statusCodes.NOT_FOUND, response:res, message:"User not found"});
        return false;
    }
    req.body.id = generateId();
    req.body.source = req.owner.id;
    req.body.destination = req.params.id;
    let chat = null;
    if(req.body.file?.length && req.body.file?.length > 0) {
        for (let i = 0; i < req.body.file.length; i++) {
            const f = req.body.file[i];
            let fileName = await uploadFile(f, generateFileName("chat"), "files/chat", 'any').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
            chat = await DBinsert('chat', {...req.body, id:generateId(), file:fileName}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
            sendEvent("createMessage", {...req.body, id:generateId(), file:fileName});
        }
    } else if(req.body.file) {
        let fileName = await uploadFile(req.body.file, generateFileName("chat"), "files/chat", 'any').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        chat = await DBinsert('chat', {...req.body, id:generateId(), file:fileName}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        sendEvent("createMessage", {...req.body, id:generateId(), file:fileName});
    }
    if(req.body.content) {
        chat = await DBinsert('chat', {...req.body, id:generateId(), file:null}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        sendEvent("createMessage", {...req.body, id:generateId(), file:null});
    }
    send(201, res, "success", chat);

};
  
export {getChat, getChats, createMessage};