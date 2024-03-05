import { sendError } from '../middleware/error.js';
import { generateId } from '../middleware/id.js';
import { DBselect, DBinsert, DBdelete } from '../database/index.js';

const getAppointments = async ( req, res, next) => {
    
    const appointments = await DBselect('appointments', '*');
    res.json(appointments);

};

const getUsersAppointments = async ( req, res, next) => {

    if(req.query.specific) {

        let specifics = req.query.specific.split(',').join("','");

        const appointments = await DBselect('appointments', '*', "owner_id IN ('" + specifics + "')");
        res.json(appointments);
        return;
    }
    
    res.json({error: "You should provide users id in 'specific' query parameter"});

};

const getUserAppointments = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const appointments = await DBselect('appointments', '*', {owner_id: req.params.id});
    res.json(appointments);

};

const getDoctorsAppointments = async ( req, res, next) => {
    
    if(req.query.specific) {

        let specifics = req.query.specific.split(',').join("','");

        const appointments = await DBselect('appointments', '*', "doctor_id IN ('" + specifics + "')");
        res.json(appointments);
        return;
    }
    
    res.json({error: "You should provide doctors id in 'specific' query parameter"});

};

const getDoctorAppointments = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const appointments = await DBselect('appointments', '*', {doctor_id: req.params.id});
    res.json(appointments);

};

const getPatientsAppointments = async ( req, res, next) => {

    // To send the appointments of the patients
    // should encode the query parameter 'specific'
    // like that encodeURIComponent('specific=1,2,3,4,5') or encodeURIComponent('1,2,3,4,5')
    
    if(req.query.specific) {

        let specifics = decodeURIComponent(req.query.specific).split(',').join("','");

        const appointments = await DBselect('appointments', '*', "name IN ('" + specifics + "')");
        res.json(appointments);
        return;
    }
    
    res.json({error: "You should provide patients name in 'specific' query parameter"});

};

const getPatientAppointments = async ( req, res, next) => {
    
    const appointments = await DBselect('appointments', '*', {name: decodeURIComponent(req.params.name)});
    res.json(appointments);

};

const createAppointment = async ( req, res, next) => {

    console.log(req.body);
    req.body.owner_id = req.owner.id;
    req.body.doctor_id = req.params.id;
    req.body.id = generateId();
    const appointment = await DBinsert('appointments', req.body);
    res.json(appointment);

};

const deleteAppointment = async ( req, res, next) => {
    
    const appointment = await DBdelete('appointments', {id: req.params.id});
    res.json(appointment);
    
};

const checkAppointment = async ( req, res, next) => {
        
    const userORdoctor = req.owner.id;
    const appointment = req.params.id;
    const result = await DBselect('appointments', '*', {id: appointment});
    if(result.length == 0) {
        sendError({response:res, status:404, message:"Appointment not found"});
    } else
    if(result[0]?.owner_id == userORdoctor || result[0]?.doctor_id == userORdoctor) {
        next();
    } else {
        sendError({response:res, status:403, message:"You are not authorized to access this appointment"});
    }
}
  
export {
    getAppointments, 
    getUsersAppointments, 
    getUserAppointments, 
    getDoctorsAppointments, 
    getDoctorAppointments, 
    getPatientsAppointments, 
    getPatientAppointments, 
    createAppointment,
    deleteAppointment,
    checkAppointment
};