import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { generateId } from '../middleware/id.js';
import { DBselect, DBinsert, DBdelete } from '../database/index.js';
import { getDoctor, getDoctors } from './doctors.js';
import { getUser, getUsers } from './users.js';
import { getSpecificAppointments } from './appointment.js';
import { objectWithoutKey } from '../middleware/plugins.js';

const improveReport = async (req, res, next, reports) => {
    return new Promise(async (resolve, reject) => {
        req.query.specific = [...new Set(reports.map(r => r.doctor_id))].join(',');
        const doctors = await getDoctors(req, res, next, false);
        if(!doctors) {
            reject("Can't get doctors");
            return;
        }
        reports.forEach(report => {
            reports.filter(r => r.id == report.id)[0].doctor = doctors.filter(u => u.id == report.doctor_id).length > 0 ? objectWithoutKey(doctors.filter(u => u.id == report.doctor_id)[0], "pass") : null;
        });

        req.query.specific = [...new Set(reports.map(r => r.user_id))].join(',');
        const users = await getUsers(req, res, next, false);
        if(!doctors) {
            reject("Can't get users");
            return;
        }
        reports.forEach(report => {
            reports.filter(r => r.id == report.id)[0].user = users.filter(u => u.id == report.user_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == report.user_id)[0], "pass") : null;
        });

        req.query.specific = [...new Set(reports.map(r => r.appointment_id))].join(',');
        const appointments = await getSpecificAppointments(req, res, next);
        if(!doctors) {
            reject("Can't get appointments");
            return;
        }
        reports.forEach(report => {
            reports.filter(r => r.id == report.id)[0].appointment = appointments.filter(u => u.id == report.appointment_id).length > 0 ? objectWithoutKey(appointments.filter(u => u.id == report.appointment_id)[0], "pass") : null;
        });
        resolve(reports);
    });
};

const getReports = async ( req, res, next) => {
    
    const reports = await DBselect('report', '*').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!reports) return;

    let improvedReports = await improveReport(req, res, next, reports).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });

    send(statusCodes.OK, res, "success", improvedReports);

};

const getUsersReports = async ( req, res, next) => {

    if(req.query.specific) {
        let specifics = req.query.specific.split(',').join("','");
        const reports = await DBselect('report', '*', "user_id IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!reports) return;

        let improvedReports = await improveReport(req, res, next, reports).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });

        send(statusCodes.OK, res, "success", improvedReports);
        return;
    }
    sendError({response:res, status:statusCodes.NOT_FOUND, message:"You should provide users id in 'specific' query parameter"});

};

const getUserReports = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const reports = await DBselect('report', '*', {user_id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!reports) return;

    let improvedReports = await improveReport(req, res, next, reports).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });

    send(statusCodes.OK, res, "success", improvedReports);

};

const getDoctorsReports = async ( req, res, next) => {
    
    if(req.query.specific) {
        let specifics = req.query.specific.split(',').join("','");
        const reports = await DBselect('report', '*', "doctor_id IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!reports) return;

        let improvedReports = await improveReport(req, res, next, reports).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });

        send(statusCodes.OK, res, "success", improvedReports);
        return;
    }
    sendError({response:res, status:statusCodes.NOT_FOUND, message:"You should provide doctors id in 'specific' query parameter"});

};

const getDoctorReports = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const reports = await DBselect('report', '*', {doctor_id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!reports) return;

    let improvedReports = await improveReport(req, res, next, reports).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });

    send(statusCodes.OK, res, "success", improvedReports);

};

const getPatientsReports = async ( req, res, next) => {
    
    if(req.query.specific) {
        let specifics = decodeURIComponent(req.query.specific).split(',').join("','");
        const appointmentsID = await DBselect('appointments', 'id', "name IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!appointmentsID) return;
        console.log(appointmentsID.map(app => app.id).join("','"));
        const reports = await DBselect('report', '*', "appointment_id IN ('" + appointmentsID.map(app => app.id).join("','") + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!reports) return;

        let improvedReports = await improveReport(req, res, next, reports).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });

        send(statusCodes.OK, res, "success", improvedReports);
        return;
    }
    sendError({response:res, status:statusCodes.NOT_FOUND, message:"You should provide patients name in 'specific' query parameter"});

};

const getPatientReports = async ( req, res, next) => {
    
    const appointmentID = await DBselect('appointments', 'id', {name: decodeURIComponent(req.params.name)}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!appointmentID) return;
    const reports = await DBselect('report', '*', {appointment_id: appointmentID.map(app => app.id)}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!reports) return;

    let improvedReports = await improveReport(req, res, next, reports).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });

    send(statusCodes.OK, res, "success", improvedReports);

};

const createReport = async ( req, res, next) => {

    req.body.doctor_id = req.owner.id;
    req.body.appointment_id = req.params.appId;
    req.body.user_id = req.params.id;
    req.body.id = generateId();
    const report = await DBinsert('report', req.body).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!report) return;
    send(statusCodes.CREATED, res, "success", report);

};

const checkReport = async ( req, res, next) => {

    req.body.doctor_id = req.owner.id;
    req.body.appointment_id = req.params.appId;
    req.body.user_id = req.params.id;
    const report = await DBselect('appointments', '*', "doctor_id = '" + req.owner.id + "' AND id = '" + req.params.appId + "' AND owner_id = '" + req.params.id + "'").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!report) return;
    console.log("report : ",report);
    if(report.length > 0) {
        next();
    } else {
        send(statusCodes.FORBIDDEN, res, "You are not allowed to create a report for this appointment");
    }

};

const checkReportToDelete = async ( req, res, next) => {

    let owner = req.owner?.id;
    if(req.systemToken) {
        next();
        return;
    }
    if(req.owner.role == "admin") {
        next();
        return;
    }
    let reportID = req.params.id;
    const report = await DBselect('appointments', '*', "doctor_id = '" + owner + "' AND id = '" + reportID + "'").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!report) return;
    if(report.length > 0) {
        next();
    } else {
        send(statusCodes.FORBIDDEN, res, "You are not allowed to delete this report because you are not the doctor who created this report ('The admin can delete any report')");
    }

};

const deleteReport = async ( req, res, next) => {

    const report = await DBdelete('report', {id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!report) return;
    send(statusCodes.OK, res, "success", report);

};
  
export {
    getReports,
    getUsersReports,
    getUserReports,
    getDoctorsReports,
    getDoctorReports,
    getPatientsReports,
    getPatientReports,
    createReport,
    checkReport,
    checkReportToDelete,
    deleteReport
};