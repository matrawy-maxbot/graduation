import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { generateId } from '../middleware/id.js';
import { objectWithoutKey } from '../middleware/plugins.js';
import { DBselect, DBinsert, DBupdate, DBdelete } from '../database/index.js';
import { getDoctor, getDoctors } from './doctors.js';
import { getUser, getUsers } from './users.js';

const getAppointments = async ( req, res, next) => {
    
    const appointments = await DBselect('appointments', '*').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!appointments) return;
    req.query.specific = [...new Set(appointments.map(a => a.doctor_id))].join(',');
    console.log("appointments doctors : ", req.query.specific);
    const doctors = await getDoctors(req, res, next, false);
    console.log("appointments doctors : ", doctors);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].doctor = doctors.filter(u => u.id == appointment.doctor_id).length > 0 ? objectWithoutKey(doctors.filter(u => u.id == appointment.doctor_id)[0], "pass") : null;
    });
    req.query.specific = [...new Set(appointments.map(a => a.owner_id))].join(',');
    console.log("appointments users : ", req.query.specific);
    const users = await getUsers(req, res, next, false);
    console.log("appointments users : ", users);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
    });
    send(200, res, "success", appointments);

};

const getUsersAppointments = async ( req, res, next) => {

    if(req.query.specific) {
        let specifics = req.query.specific.split(',').join("','");
        const appointments = await DBselect('appointments', '*', "owner_id IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!appointments) return;
        req.query.specific = [...new Set(appointments.map(a => a.doctor_id))].join(',');
        console.log("appointments doctors : ", req.query.specific);
        const doctors = await getDoctors(req, res, next, false);
        console.log("appointments doctors : ", doctors);
        appointments.forEach(appointment => {
            appointments.filter(u => u.id == appointment.id)[0].doctor = doctors.filter(u => u.id == appointment.doctor_id).length > 0 ? objectWithoutKey(doctors.filter(u => u.id == appointment.doctor_id)[0], "pass") : null;
        });
        req.query.specific = [...new Set(appointments.map(a => a.owner_id))].join(',');
        console.log("appointments users : ", req.query.specific);
        const users = await getUsers(req, res, next, false);
        console.log("appointments users : ", users);
        appointments.forEach(appointment => {
            appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
        });
        send(200, res, "success", appointments);
        return;
    }
    sendError({response:res, status:statusCodes.BAD_REQUEST, message:"You should provide users id in 'specific' query parameter"});

};

const getUserAppointments = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const appointments = await DBselect('appointments', '*', {owner_id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!appointments) return;
    req.params.id = req.params.id;
    console.log("appointments users : ", req.params.id);
    const users = await getUser(req, res, next, false);
    console.log("appointments users : ", users);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
    });
    req.params.id = [...new Set(appointments.map(a => a.doctor_id))].join(',');
    console.log("appointments doctors : ", req.query.specific);
    const doctors = await getDoctors(req, res, next, false);
    console.log("appointments doctors : ", doctors);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].doctor = doctors.filter(u => u.id == appointment.doctor_id).length > 0 ? objectWithoutKey(doctors.filter(u => u.id == appointment.doctor_id)[0], "pass") : null;
    });
    send(200, res, "success", appointments);

};

const getDoctorsAppointments = async ( req, res, next) => {
    
    if(req.query.specific) {
        let specifics = req.query.specific.split(',').join("','");
        const appointments = await DBselect('appointments', '*', "doctor_id IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!appointments) return;
        req.query.specific = [...new Set(appointments.map(a => a.doctor_id))].join(',');
        console.log("appointments doctors : ", req.query.specific);
        const doctors = await getDoctors(req, res, next, false);
        console.log("appointments doctors : ", doctors);
        appointments.forEach(appointment => {
            appointments.filter(u => u.id == appointment.id)[0].doctor = doctors.filter(u => u.id == appointment.doctor_id).length > 0 ? objectWithoutKey(doctors.filter(u => u.id == appointment.doctor_id)[0], "pass") : null;
        });
        req.query.specific = [...new Set(appointments.map(a => a.owner_id))].join(',');
        console.log("appointments users : ", req.query.specific);
        const users = await getUsers(req, res, next, false);
        console.log("appointments users : ", users);
        appointments.forEach(appointment => {
            appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
        });
        send(200, res, "success", appointments);
        return;
    }
    sendError({response:res, status:statusCodes.BAD_REQUEST, message:"You should provide doctors id in 'specific' query parameter"});

};

const getDoctorAppointments = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const appointments = await DBselect('appointments', '*', {doctor_id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!appointments) return;
    req.params.id = req.params.id;
    console.log("appointments doctors : ", req.params.id);
    const doctors = await getDoctor(req, res, next, false);
    console.log("appointments doctors : ", doctors);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].doctor = doctors.filter(u => u.id == appointment.doctor_id).length > 0 ? objectWithoutKey(doctors.filter(u => u.id == appointment.doctor_id)[0], "pass") : null;
    });
    req.query.specific = [...new Set(appointments.map(a => a.owner_id))].join(',');
    console.log("appointments users : ", req.query.specific);
    const users = await getUsers(req, res, next, false);
    console.log("appointments users : ", users);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
    });
    send(200, res, "success", appointments);

};

const getPatientsAppointments = async ( req, res, next) => {
    
    if(req.query.specific) {
        let specifics = decodeURIComponent(req.query.specific).split(',').join("','");
        const appointments = await DBselect('appointments', '*', "name IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!appointments) return;
        req.query.specific = [...new Set(appointments.map(a => a.doctor_id))].join(',');
        console.log("appointments doctors : ", req.query.specific);
        const doctors = await getDoctors(req, res, next, false);
        console.log("appointments doctors : ", doctors);
        appointments.forEach(appointment => {
            appointments.filter(u => u.id == appointment.id)[0].doctor = doctors.filter(u => u.id == appointment.doctor_id).length > 0 ? objectWithoutKey(doctors.filter(u => u.id == appointment.doctor_id)[0], "pass") : null;
        });
        req.query.specific = [...new Set(appointments.map(a => a.owner_id))].join(',');
        console.log("appointments users : ", req.query.specific);
        const users = await getUsers(req, res, next, false);
        console.log("appointments users : ", users);
        appointments.forEach(appointment => {
            appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
        });
        send(200, res, "success", appointments);
        return;
    }
    sendError({response:res, status:statusCodes.BAD_REQUEST, message:"You should provide patients name in 'specific' query parameter"});

};

const getPatientAppointments = async ( req, res, next) => {
    
    const appointments = await DBselect('appointments', '*', {name: decodeURIComponent(req.params.name)}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!appointments) return;
    req.query.specific = [...new Set(appointments.map(a => a.doctor_id))].join(',');
    console.log("appointments doctors : ", req.query.specific);
    const doctors = await getDoctors(req, res, next, false);
    console.log("appointments doctors : ", doctors);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].doctor = doctors.filter(u => u.id == appointment.doctor_id).length > 0 ? objectWithoutKey(doctors.filter(u => u.id == appointment.doctor_id)[0], "pass") : null;
    });
    req.query.specific = [...new Set(appointments.map(a => a.owner_id))].join(',');
    console.log("appointments users : ", req.query.specific);
    const users = await getUsers(req, res, next, false);
    console.log("appointments users : ", users);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
    });
    send(200, res, "success", appointments);

};

const createAppointment = async ( req, res, next) => {

    console.log(req.body);
    req.body.owner_id = req.owner.id;
    req.body.doctor_id = req.params.id;
    req.body.id = generateId();
    // req.body.department = is filled by checkDoctor function in the middleware
    const appointment = await DBinsert('appointments', req.body).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!appointment) return;
    send(201, res, "success", appointment);

};

const deleteAppointment = async ( req, res, next) => {
    
    const appointment = await DBdelete('appointments', {id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!appointment) return;
    send(200, res, "success", appointment);
    
};

const checkAppointment = async ( req, res, next) => {
        
    const userORdoctor = req.owner.id;
    const appointment = req.params.id;
    const result = await DBselect('appointments', '*', {id: appointment}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!result) return;
    if(result.length == 0) {
        sendError({response:res, status:statusCodes.NOT_FOUND, message:"Appointment not found"});
    } else if(result[0]?.owner_id == userORdoctor || result[0]?.doctor_id == userORdoctor) {
        next();
    } else {
        sendError({response:res, status:statusCodes.FORBIDDEN, message:"You are not authorized to access this appointment"});
    }

}

const completeAppointment = async ( req, res, next) => {
        
    const appointment = req.params.id;
    const result = await DBselect('appointments', '*', {id: appointment}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!result) return;
    if(result.length == 0) {
        sendError({response:res, status:statusCodes.NOT_FOUND, message:"Appointment not found"});
    } else {
        const updated = await DBupdate('appointments', {completed: 1}, {id: appointment}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!updated) return sendError({response:res, status:statusCodes.INTERNAL_SERVER_ERROR, message:"Could not complete the appointment"});
        send(200, res, "success", updated);
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
    checkAppointment,
    completeAppointment
};