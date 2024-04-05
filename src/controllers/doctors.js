import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { DBselect, DBinsert, DBupdate, DBdelete, uploadFile } from '../database/index.js';
import { createSchedules } from './schedule.js';
import { generateId } from '../middleware/id.js';
import { hash } from '../middleware/hash.js';
import { objectWithoutKey } from '../middleware/plugins.js';
import { getDoctorRatings, getDoctorsRatings } from './ratings.js';

const getDoctors = async ( req, res, next) => {

    console.log("doctors doctors doctors");

    let doctors;
    if(req.query.specific) {
        let specifics = req.query.specific.split(',').join("','");
        doctors = await DBselect('doctors', '*', "id IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!doctors) return;
    } else {
        doctors = await DBselect('doctors', '*').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!doctors) return;
    }
    const ratings = await getDoctorsRatings(req, res, next, false);
    console.log(ratings);
    doctors.forEach(doc => {
        doctors.filter(d => d.id == doc.id)[0].ratings = ratings.filter(r => r.doctor_id == doc.id);
    });
    send(200, res, "success", doctors, ['pass', 'password']);

};

const getDoctor = async ( req, res, next) => {

    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const doctor = await DBselect('doctors', '*', {id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!doctor) return;
    const ratings = await getDoctorRatings(req, res, next, false);
    const dr = ratings.filter(r => r.doctor_id == doctor[0].id);
    doctor[0].ratings = dr;
    send(200, res, "success", doctor, ['pass', 'password']);

};

const createDoctor = async ( req, res, next) => {

    console.log(req.body);
    req.body.id = generateId();
    req.body.pass = req.body.password || req.body.pass;
    if(req.body.pass) req.body.pass = await hash(req.body.pass);
    const doctor = await DBinsert('doctors', req.body).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!doctor) return;
    createSchedules(req, res, next, false);
    send(201, res, "success", doctor, ['pass', 'password']);

};

const updateDoctor = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    if(req.body.avatar?.length && req.body.avatar?.length > 0) req.body.avatar = req.body.avatar[0];
    if(req.body.avatar) {
        let fileName = await uploadFile(req.body.avatar, "avatar"+req.params.id, "files/avatar", 'image').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        req.body.avatar = fileName;
    }
    const body = objectWithoutKey(req.body, 'pass');
    const doctor = await DBupdate('doctors', body, {id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!doctor) return;
    send(200, res, "success", doctor, ['pass', 'password']);
    
};

const deleteDoctor = async ( req, res, next) => {
    let id = req.params.id;
    const doctor = await DBdelete('doctors', {id: id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!doctor) return;
    send(200, res, "success", doctor, ['pass', 'password']);
};

const checkDoctor = async (req, res, next) => {
    const doctor = await DBselect('doctors', '*', {id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!doctor) return;
    if(doctor.length == 0) sendError({status: statusCodes.NOT_FOUND, response:res, message: "Doctor not found"});
    req.body.department = doctor[0].speciality;
    next();
}
  
export {getDoctors, getDoctor, createDoctor, updateDoctor, deleteDoctor, checkDoctor};