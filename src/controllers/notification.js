import { sendError } from '../middleware/error.js';
import { DBselect, DBinsert } from '../database/index.js';

const getNotifications = async ( req, res, next) => {
    
    const notifications = await DBselect('notifications', '*', "source = '" + req.params.id + "' OR destination = '" + req.params.id + "'");
    res.json(notifications);

};

const createNotification = async ( req, res, next) => {

    req.body.destination = req.params.id;
    console.log(req.body);
    const notification = await DBinsert('notifications', req.body);
    res.json(notification);

};
  
export {getNotifications, createNotification};