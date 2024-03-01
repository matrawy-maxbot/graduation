import { sendError } from '../middleware/error.js';
import { DBselect, DBinsert } from '../database/index.js';

const getAdmins = async ( req, res, next) => {

    if(req.query.specific) {

        let specifics = req.query.specific.split(',').join("','");

        const admins = await DBselect('admins', '*', "id IN ('" + specifics + "')");
        res.json(admins);
        return;
    }
    
    const admins = await DBselect('admins', '*');
    res.json(admins);

};

const getAdmin = async ( req, res, next) => {

    const admin = await DBselect('admins', '*', {id: req.params.id});
    res.json(admin);

};

const createAdmin = async ( req, res, next) => {

    console.log(req.body);
    const admin = await DBinsert('admins', req.body);
    res.json(admin);

};
  
export {getAdmins, getAdmin, createAdmin};