import { sendError } from '../middleware/error.js';
import { generateId } from '../middleware/id.js';
import { hash } from '../middleware/hash.js';
import { objectWithoutKey } from '../middleware/plugins.js';
import { generateToken } from '../middleware/authentication.js'
import { DBselect, DBinsert, DBupdate } from '../database/index.js';

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

    console.log("req.params.id : ",req.url)
    const param = req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const admin = await DBselect('admins', '*', {id: req.params.id});
    res.json(admin);
    

};

const createAdmin = async ( req, res, next) => {

    console.log(req.body);
    req.body.id = generateId();
    req.body.pass = req.body.password || req.body.pass;
    req.body.pass = await hash(req.body.pass);
    const JWTToken = generateToken({id: req.body.id});
    console.log("JWTToken : ",JWTToken);
    const admin = await DBinsert('admins', req.body);
    res.json(admin);

};

const updateAdmin = async ( req, res, next) => {
    
    console.log("req.params.id : ",req.url)
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const body = objectWithoutKey(req.body, 'pass');
    const admin = await DBupdate('admins', body, {id: req.params.id});
    res.json(admin);
    
};
  
export {getAdmins, getAdmin, createAdmin, updateAdmin};