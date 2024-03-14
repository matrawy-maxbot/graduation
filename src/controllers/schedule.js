import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { DBselect, DBinsert, DBupdate } from '../database/index.js';

const getSchedules = async ( req, res, next) => {
    
    if(req.query.specific) {
        let specifics = req.query.specific.split(',').join("','");
        const schedules = await DBselect('schedules', '*', "doctor_id IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!schedules) return;
        send(200, res, "success", schedules);
        return;
    }
    const schedules = await DBselect('schedules', '*').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!schedules) return;
    send(200, res, "success", schedules);

};

const getDoctorSchedules = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const schedules = await DBselect('schedules', '*', {doctor_id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!schedules) return;
    send(200, res, "success", schedules);

};

const createSchedules = async ( req, res, next, ret = true) => {

    console.log(req.body);
    const schedule = await DBinsert('schedules', {doctor_id:req.body.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!schedule) return;
    if (ret) send(201, res, "success", schedule);
    else return schedule;

};

const updateSchedules = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const schedules = await DBupdate('schedules', req.body, {doctor_id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!schedules) return;
    send(200, res, "success", schedules);
    
};

export {getSchedules, getDoctorSchedules, createSchedules, updateSchedules};