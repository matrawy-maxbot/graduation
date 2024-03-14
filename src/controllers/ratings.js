import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { generateId } from '../middleware/id.js';
import { DBselect, DBinsert, DBupdate } from '../database/index.js';

const getRatings = async ( req, res, next) => {
    
    const ratings = await DBselect('ratings', '*').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!ratings) return;
    send(200, res, "success", ratings);

};

const getDoctorsRatings = async ( req, res, next, ret = true) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(req.query.specific) {

                let specifics = req.query.specific.split(',').join("','");
    
                const ratings = await DBselect('ratings', '*', "doctor_id IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
                if(!ratings) return;
                if(ret) send(200, res, "success", ratings);
                resolve(ratings);
            }
            
            const ratings = await DBselect('ratings', '*').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
            if(!ratings) return;
            if(ret) send(200, res, "success", ratings);
            resolve(ratings);
        } catch (error) {
            reject(error);
        }
    });
};

const getDoctorRatings = async ( req, res, next, ret = true) => {
    return new Promise(async (resolve, reject) => {
        try {
            const id = req.params.id;
            const ratings = await DBselect('ratings', '*', {doctor_id: id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
            if(!ratings) return;
            if(ret) send(200, res, "success", ratings);
            resolve(ratings);
        } catch (error) {
            reject(error);
        }
    });
};

const getUsersRatings = async ( req, res, next, ret = true) => {

    return new Promise(async (resolve, reject) => {
        try {
            if(req.query.specific) {

                let specifics = req.query.specific.split(',').join("','");
    
                const ratings = await DBselect('ratings', '*', "user_id IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
                if(!ratings) return;
                if(ret) send(200, res, "success", ratings);
                resolve(ratings);
            }
            
            const ratings = await DBselect('ratings', '*').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
            if(!ratings) return;
            if(ret) send(200, res, "success", ratings);
            resolve(ratings);
        } catch (error) {
            reject(error);
        }
    });

};

const getUserRatings = async ( req, res, next, ret = true) => {
    return new Promise(async (resolve, reject) => {
        try {
            const id = req.params.id;
            const ratings = await DBselect('ratings', '*', {user_id: id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
            if(!ratings) return;
            if(ret) send(200, res, "success", ratings);
            resolve(ratings);
        } catch (error) {
            reject(error);
        }
    });
};

const createRating = async ( req, res, next) => {

    req.body.id = generateId();
    req.body.user_id = req.owner.id;
    req.body.doctor_id = req.params.id;
    req.body.rating = Number.parseInt(req.params.rating, 10);
    console.log(req.body);
    const rating = await DBinsert('ratings', req.body).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!rating) return;
    send(201, res, "success", rating);

};

const updateRating = async ( req, res, next) => {

    const rating = await DBupdate('ratings', {rating: Number.parseInt(req.params.rating, 10)}, {user_id: req.owner.id, doctor_id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!rating) return;
    send(200, res, "success", rating);

};

export {
    getRatings,
    getDoctorsRatings,
    getDoctorRatings,
    getUsersRatings,
    getUserRatings,
    createRating,
    updateRating
};