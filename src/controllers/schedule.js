import { sendError } from '../middleware/error.js';
import { DBselect, DBinsert } from '../database/index.js';

const getSchedules = async ( req, res, next) => {
    
    if(req.query.specific) {

        let specifics = req.query.specific.split(',').join("','");

        const appointments = await DBselect('schedules', '*', "doctor_id IN ('" + specifics + "')");
        res.json(appointments);
        return;
    }
    
    const schedules = await DBselect('schedules', '*');
    res.json(schedules);

};

const getDoctorSchedules = async ( req, res, next) => {
    
    const schedules = await DBselect('schedules', '*', {doctor_id: req.params.id});
    res.json(schedules);

};

const createSchedules = async ( req, res, next, ret = true) => {

    console.log(req.body);
    const schedule = await DBinsert('schedules', {doctor_id:req.body.id});
    if (ret) res.json(schedule);
    else return schedule;

};

export {getSchedules, getDoctorSchedules, createSchedules};