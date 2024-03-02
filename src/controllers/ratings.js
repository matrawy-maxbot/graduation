import { sendError } from '../middleware/error.js';
import { DBselect, DBinsert, DBupdate } from '../database/index.js';

const getRatings = async ( req, res, next) => {
    
    const ratings = await DBselect('ratings', '*');
    res.json(ratings);

};

const getDoctorsRatings = async ( req, res, next, ret = true) => {
    return new Promise(async (resolve, reject) => {
        try {
            if(req.query.specific) {

                let specifics = req.query.specific.split(',').join("','");
    
                const ratings = await DBselect('ratings', '*', "doctor_id IN ('" + specifics + "')");
                if(ret) res.json(ratings);
                resolve(ratings);
            }
            
            const ratings = await DBselect('ratings', '*');
            if(ret) res.json(ratings);
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
            const ratings = await DBselect('ratings', '*', {doctor_id: id});
            if(ret) res.json(ratings);
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
    
                const ratings = await DBselect('ratings', '*', "user_id IN ('" + specifics + "')");
                if(ret) res.json(ratings);
                resolve(ratings);
            }
            
            const ratings = await DBselect('ratings', '*');
            if(ret) res.json(ratings);
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
            const ratings = await DBselect('ratings', '*', {user_id: id});
            if(ret) res.json(ratings);
            resolve(ratings);
        } catch (error) {
            reject(error);
        }
    });
};

const createRating = async ( req, res, next) => {

    req.body.user_id = "ds432terg35";
    req.body.doctor_id = req.params.id;
    req.body.rating = Number.parseInt(req.params.rating, 10);
    console.log(req.body);
    const rating = await DBinsert('ratings', req.body);
    res.json(rating);

};

const updateRating = async ( req, res, next) => {

    const id = "54321";
    const rating = await DBupdate('ratings', {rating: Number.parseInt(req.params.rating, 10)}, {user_id: id, doctor_id: req.params.id});
    res.json(rating);

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