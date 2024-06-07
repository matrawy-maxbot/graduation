import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { generateId } from '../middleware/id.js';
import { objectWithoutKey } from '../middleware/plugins.js';
import { DBselect, DBinsert, DBupdate, DBdelete } from '../database/index.js';
import { getDoctor, getDoctors } from './doctors.js';
import { getUser, getUsers } from './users.js';
import moment from 'moment';
import prettyMilliseconds from 'pretty-ms';

const improveAppointments = async (appointments, doctors) => {
    return new Promise(async (resolve, reject) => {

        let docApps = appointments.map(a => a.doctor_id);
        docApps = [...new Set(docApps)];
        let doctorsApps = [];
        docApps.forEach(doctor => {
            doctorsApps.push({
                doctorID: doctor, 
                doctor: doctors.filter(d => d.id == doctor)[0], 
                appointments: appointments.filter(a => a.doctor_id == doctor)
            });
        });

        doctorsApps.forEach(doctor => {
            doctor.appointments.forEach(appointment => {
                let appCreateTimestamp = new Date(moment(appointment.created_at).format("ddd, MM MMM YYYY HH:mm:ss") + " GMT");
                doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appointments.filter(a => a.id == appointment.id)[0].created_at = appCreateTimestamp;
                doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appointments.filter(a => a.id == appointment.id)[0].appDateTimestamp = new Date(new Date(appointment.app_date).setHours(0, 0, 0, 0)).getTime();
                doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appointments.filter(a => a.id == appointment.id)[0].appCreateTimestamp = appCreateTimestamp.getTime();
            });
        });

        doctorsApps.forEach(doctor => {
            doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDateArray = doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appointments.map(a => a.appDateTimestamp);
            doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDateArray = [...new Set(doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDateArray)];
            doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDate = [];
            doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDateArray.forEach(date => {
                doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDate.push({
                    date: date,
                    appointments: doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appointments.filter(a => a.appDateTimestamp == date)
                });
            });
        });

        doctorsApps.forEach(doctor => {
            doctor.appsDate.forEach(date => {
                doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDate.filter(app => app.date == date.date)[0].appointments = date.appointments.sort(function (a, b) {   
                    return a.appCreateTimestamp - b.appCreateTimestamp;
                });
            });
        });

        let newAppointments = [];

        doctorsApps.forEach(doctor => {
            doctor.appsDate.forEach(date => {
                let DocAppAppointments = doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDate.filter(app => app.date == date.date)[0].appointments.map(a => a.id);
                let DocAppAppointmentsTurnNow = doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDate.filter(app => app.date == date.date)[0].appointments.filter(a => a.completed == 0 || a.completed == '0')?.map(a => a?.id)[0];
                let turnNow = DocAppAppointments.indexOf(DocAppAppointmentsTurnNow) + 1;
                turnNow = turnNow == 0 ? DocAppAppointments.length : turnNow;
                date.appointments.forEach(appointment => {
                    let turn = DocAppAppointments.indexOf(appointment.id) + 1;
                    doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDate.filter(app => app.date == date.date)[0].appointments.filter(appoint => appoint.id == appointment.id)[0].turn = turn;
                    doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDate.filter(app => app.date == date.date)[0].appointments.filter(appoint => appoint.id == appointment.id)[0].turnNow = turnNow;
                    doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDate.filter(app => app.date == date.date)[0].appointments.filter(appoint => appoint.id == appointment.id)[0].turnLeft = turn - turnNow;
                    let doctor_default_patient_time = doctor.doctor?.default_patient_time ? doctor.doctor.default_patient_time : 600;
                    doctor_default_patient_time = doctor_default_patient_time * 1000;
                    let turnLeftDuration = "finished";
                    turnLeftDuration = (turn - turnNow) > 0 ? (turn - turnNow) * doctor_default_patient_time : 0;
                    doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDate.filter(app => app.date == date.date)[0].appointments.filter(appoint => appoint.id == appointment.id)[0].turnLeftDuration = turnLeftDuration;
                    doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDate.filter(app => app.date == date.date)[0].appointments.filter(appoint => appoint.id == appointment.id)[0].turnLeftDurationString = prettyMilliseconds(turnLeftDuration);
                    newAppointments.push(doctorsApps.filter(d => d.doctorID == doctor.doctorID)[0].appsDate.filter(app => app.date == date.date)[0].appointments.filter(appoint => appoint.id == appointment.id)[0]);
                    if(newAppointments.length == appointments.length) resolve(newAppointments);
                });
            });
        });

    });
}

const getAppointments = async ( req, res, next) => {
    
    const appointments = await DBselect('appointments', '*').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!appointments) return;
    req.query.specific = [...new Set(appointments.map(a => a.doctor_id))].join(',');
    const doctors = await getDoctors(req, res, next, false);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].doctor = doctors.filter(u => u.id == appointment.doctor_id).length > 0 ? objectWithoutKey(doctors.filter(u => u.id == appointment.doctor_id)[0], "pass") : null;
    });
    req.query.specific = [...new Set(appointments.map(a => a.owner_id))].join(',');
    const users = await getUsers(req, res, next, false);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
    });

    let newAppointments = await improveAppointments(appointments, doctors);

    send(200, res, "success", /*appointments*/newAppointments);

};

const getUsersAppointments = async ( req, res, next) => {

    if(req.query.specific) {
        let specifics = req.query.specific.split(',').join("','");
        const appointments = await DBselect('appointments', '*', "owner_id IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!appointments) return;
        req.query.specific = [...new Set(appointments.map(a => a.doctor_id))].join(',');
        const doctors = await getDoctors(req, res, next, false);
        appointments.forEach(appointment => {
            appointments.filter(u => u.id == appointment.id)[0].doctor = doctors.filter(u => u.id == appointment.doctor_id).length > 0 ? objectWithoutKey(doctors.filter(u => u.id == appointment.doctor_id)[0], "pass") : null;
        });
        req.query.specific = [...new Set(appointments.map(a => a.owner_id))].join(',');
        const users = await getUsers(req, res, next, false);
        appointments.forEach(appointment => {
            appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
        });
        let newAppointments = await improveAppointments(appointments, doctors);
        send(200, res, "success", newAppointments);
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
    const users = await getUser(req, res, next, false);
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
    let newAppointments = await improveAppointments(appointments, doctors);
    send(200, res, "success", newAppointments);

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
        const users = await getUsers(req, res, next, false);
        appointments.forEach(appointment => {
            appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
        });
        let newAppointments = await improveAppointments(appointments, doctors);
        send(200, res, "success", newAppointments);
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
    const users = await getUsers(req, res, next, false);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
    });
    let newAppointments = await improveAppointments(appointments, doctors);
    send(200, res, "success", newAppointments);

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
        const users = await getUsers(req, res, next, false);
        appointments.forEach(appointment => {
            appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
        });
        let newAppointments = await improveAppointments(appointments, doctors);
        send(200, res, "success", newAppointments);
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
    const users = await getUsers(req, res, next, false);
    appointments.forEach(appointment => {
        appointments.filter(u => u.id == appointment.id)[0].owner = users.filter(u => u.id == appointment.owner_id).length > 0 ? objectWithoutKey(users.filter(u => u.id == appointment.owner_id)[0], "pass") : null;
    });
    let newAppointments = await improveAppointments(appointments, doctors);
    send(200, res, "success", newAppointments);

};

const getDoctorSchedule = async (doctorID) => {
    try {
        console.log("doctorID: ", doctorID);
        let doctorSchedule = await DBselect("schedules", "*", {doctor_id:doctorID.toString()}).catch(err => { throw err; });
        if(!doctorSchedule) throw "400#This doctor has not schedule";
        if(doctorSchedule.length == 0) throw "400#This doctor has not schedule";
        return doctorSchedule[0];
    } catch (error) {
        throw error;
    }
}

const checkDateOnDoctor = async (req, res, next) => {
    try {
        let drID = req.params.id;
        let val = req.body.app_date;
        let dayName = new Date(val).toLocaleDateString("en-EN", { weekday: 'long' }).toLowerCase();
        let doctorSchedule = await getDoctorSchedule(drID).catch(err => { throw err; })
        console.log("doctorSchedule: ", doctorSchedule);
        console.log("dayName: ", dayName);
        console.log("check:", doctorSchedule[dayName]);
        console.log("check Monday:", doctorSchedule["monday"]);
        if(!doctorSchedule[dayName] || doctorSchedule[dayName] == null) sendError({response:res, status:statusCodes.BAD_REQUEST, message:"This doctor is not available on this day"});
        console.log("check2:", doctorSchedule[dayName]);
        next();
    } catch (error) {
        throw error;
    }
}

const createAppointment = async (req, res, next) => {

    try {
        console.log(req.body);
        req.body.owner_id = req.owner.id;
        req.body.doctor_id = req.params.id;
        req.body.id = generateId();
        req.body.created_at = new Date().toISOString();
        let app_date = req.body.app_date;

        console.log("checkDateOnDoctor: ", app_date);

        // req.body.department = is filled by checkDoctor function in the middleware
        const appointment = await DBinsert('appointments', req.body).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!appointment) return;
        send(201, res, "success", appointment);
    } catch (error) {
        sendError({status:statusCodes.BAD_REQUEST, response:res, message:error});
    }

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
    } else if(result[0]?.owner_id == userORdoctor || result[0]?.doctor_id == userORdoctor || req.owner.role == "admin") {
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
    completeAppointment,
    checkDateOnDoctor
};
