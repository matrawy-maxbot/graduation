import { sendError } from '../middleware/error.js';
import { DBselect, DBinsert } from '../database/index.js';
import { createSchedules } from './schedule.js';
import { getDoctorRatings, getDoctorsRatings } from './ratings.js';

const getDoctors = async ( req, res, next) => {

    let doctors;
    if(req.query.specific) {
        let specifics = req.query.specific.split(',').join("','");
        doctors = await DBselect('doctors', '*', "id IN ('" + specifics + "')");
    } else {
        doctors = await DBselect('doctors', '*');
    }
    const ratings = await getDoctorsRatings(req, res, next, false);
    console.log(ratings);
    doctors.forEach(doc => {
        doctors.filter(d => d.id == doc.id)[0].ratings = ratings.filter(r => r.doctor_id == doc.id);
    });
    res.json(doctors);

};

const getDoctor = async ( req, res, next) => {

    const doctor = await DBselect('doctors', '*', {id: req.params.id});
    const ratings = await getDoctorRatings(req, res, next, false);
    const dr = ratings.filter(r => r.doctor_id == doctor[0].id);
    doctor[0].ratings = dr;
    res.json(doctor);

};

const createDoctor = async ( req, res, next) => {

    console.log(req.body);
    const doctor = await DBinsert('doctors', req.body);
    createSchedules(req, res, next, false);
    res.json(doctor);

};
  
export {getDoctors, getDoctor, createDoctor};