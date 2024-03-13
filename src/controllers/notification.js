import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { generateId } from '../middleware/id.js';
import { DBselect, DBinsert } from '../database/index.js';
import { event, sendEvent } from '../socket/events.js';
import { checkLogin } from './login.js';

const getNotifications = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const notifications = await DBselect('notifications', '*', "source = '" + req.params.id + "' OR destination = '" + req.params.id + "'").catch(err => { sendError({status:400, response:res, message:err}); return false; });
    if(!notifications) return;
    send(200, res, "success", notifications);

};

const createNotification = async ( req, res, next) => {

    let checkID = await checkLogin(req.params.id, "id");
    if(!checkID) {
        sendError({status:404, response:res, message:"User not found"});
        return false;
    }
    if(!req.owner) {
        req.owner = {};
        req.owner.id = "system";
    }
    req.body.id = generateId();
    req.body.source = req.owner.id;
    req.body.destination = req.params.id;
    console.log(req.body);
    const notification = await DBinsert('notifications', req.body).catch(err => { sendError({status:400, response:res, message:err}); return false; });
    sendEvent("createNotification", req.body);
    if(!notification) return;
    send(201, res, "success", notification);

};
  
export {getNotifications, createNotification};