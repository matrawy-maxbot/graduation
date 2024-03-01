import { sendError } from '../middleware/error.js';
import { DBselect, DBinsert } from '../database/index.js';

const getReports = async ( req, res, next) => {
    
    const reports = await DBselect('report', '*');
    res.json(reports);

};

const getUsersReports = async ( req, res, next) => {

    if(req.query.specific) {

        let specifics = req.query.specific.split(',').join("','");

        const reports = await DBselect('report', '*', "user_id IN ('" + specifics + "')");
        res.json(reports);
        return;
    }
    
    res.json({error: "You should provide users id in 'specific' query parameter"});

};

const getUserReports = async ( req, res, next) => {
    
    const reports = await DBselect('report', '*', {user_id: req.params.id});
    res.json(reports);

};

const getDoctorsReports = async ( req, res, next) => {
    
    if(req.query.specific) {

        let specifics = req.query.specific.split(',').join("','");

        const reports = await DBselect('report', '*', "doctor_id IN ('" + specifics + "')");
        res.json(reports);
        return;
    }
    
    res.json({error: "You should provide doctors id in 'specific' query parameter"});

};

const getDoctorReports = async ( req, res, next) => {
    
    const reports = await DBselect('report', '*', {doctor_id: req.params.id});
    res.json(reports);

};

const getPatientsReports = async ( req, res, next) => {

    // To send the report of the patients
    // should encode the query parameter 'specific'
    // like that encodeURIComponent('specific=1,2,3,4,5') or encodeURIComponent('1,2,3,4,5')
    
    if(req.query.specific) {

        let specifics = decodeURIComponent(req.query.specific).split(',').join("','");

        const appointmentsID = await DBselect('appointments', 'id', "name IN ('" + specifics + "')");
        console.log(appointmentsID.map(app => app.id).join("','"));
        const reports = await DBselect('report', '*', "appointment_id IN ('" + appointmentsID.map(app => app.id).join("','") + "')");
        res.json(reports);
        return;
    }
    
    res.json({error: "You should provide patients name in 'specific' query parameter"});

};

const getPatientReports = async ( req, res, next) => {
    
    const appointmentID = await DBselect('appointments', 'id', {name: decodeURIComponent(req.params.name)});
    const reports = await DBselect('report', '*', {appointment_id: appointmentID.map(app => app.id)});
    res.json(reports);

};

const createReport = async ( req, res, next) => {

    console.log(req.body);
    const report = await DBinsert('report', req.body);
    res.json(report);

};

  
export {getReports, getUsersReports, getUserReports, getDoctorsReports, getDoctorReports, getPatientsReports, getPatientReports, createReport};