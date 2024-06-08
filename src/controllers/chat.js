import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { generateId, generateFileName } from '../middleware/id.js';
import { DBselect, DBinsert, uploadFile } from '../database/index.js';
import { checkAccountData } from './login.js';
import { sendEvent } from '../middleware/sendEvent.js';
import { objectWithoutKey } from '../middleware/plugins.js';

const improveChat = async (chat) => {
    return new Promise(async (resolve, reject) => {
        let chatSourcesORDestinations = [];

        let sources = [...new Set(chat.map(c => c.source))];
        let destinations = [...new Set(chat.map(c => c.destination))];

        chatSourcesORDestinations = sources.concat(destinations);
        chatSourcesORDestinations = [...new Set(chatSourcesORDestinations)];

        for (let i = 0; i < chatSourcesORDestinations.length; i++) {
            const element = chatSourcesORDestinations[i];
            let userORdoctorORadmin = await checkAccountData(element, "id").catch(err => { reject(err); return false; })
            if(userORdoctorORadmin) chatSourcesORDestinations[i] = objectWithoutKey(userORdoctorORadmin, "pass");
            else chatSourcesORDestinations[i] = {id:element, name:null, phone:null, avatar:null, role:null, created_at:null};
        }

        for (let i = 0; i < chat.length; i++) {
            const element = chat[i];
            let source = chatSourcesORDestinations.find(c => c.id == element.source);
            let destination = chatSourcesORDestinations.find(c => c.id == element.destination);
            chat[i].source = source;
            chat[i].destination = destination;
        }

        resolve(chat);
    });
}

const getChats = async ( req, res, next) => {
    
    const chat = await DBselect('chat', '*').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!chat) return;

    let improvedChats = await improveChat(chat).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });

    console.log("chatSourcesORDestinations : ", improvedChats);

    send(200, res, "success", chat);

};

const getChat = async ( req, res, next) => {
    
    const senderChat = await DBselect('chat', '*', "source = '" + req.owner.id + "' AND destination = '" + req.params.id + "'").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!senderChat) return;
    const receiverChat = await DBselect('chat', '*', "source = '" + req.params.id + "' AND destination = '" + req.owner.id + "'").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!receiverChat) return;
    const chat = senderChat.concat(receiverChat);

    let improvedChats = await improveChat(chat).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });

    send(200, res, "success", improvedChats);

};

const createMessage = async ( req, res, next) => {

    let checkID = await checkAccountData(req.params.id, "id", res);
    if(!checkID) {
        sendError({status:statusCodes.NOT_FOUND, response:res, message:"User not found"});
        return false;
    }
    req.body.id = generateId();
    req.body.source = req.owner.id;
    req.body.destination = req.params.id;
    let chat = null;
    let filesLength = req.body.file?.length || 0;
    if(req.body.file && !req.body.file?.length) {
        filesLength = 1;
        req.body.file = [req.body.file];
    }
    let files = [];
    if(filesLength > 5) return sendError({status:statusCodes.BAD_REQUEST, response:res, message:"You can't upload more than 5 files"});
    for (let i = 0; i < filesLength; i++) {
        const f = req.body.file[i];
        let fileName = await uploadFile(f, generateFileName("chat"), "files/chat", 'any').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(fileName) files.push(fileName);
    }

    if(files.length > 0) files = files.join(",");
    else files = null;

    console.log("files :-------: ", files, req.body.file);

    chat = await DBinsert('chat', {...req.body, id:generateId(), file:files}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    await sendEvent("createMessage", {...req.body, id:generateId(), file:files}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });

    send(201, res, "success", chat);

};
  
export {getChat, getChats, createMessage};