import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { generateId } from '../middleware/id.js';
import { hash } from '../middleware/hash.js';
import { objectWithoutKey } from '../middleware/plugins.js';
import { DBselect, DBinsert, DBupdate, uploadFile } from '../database/index.js';

const getAdmins = async ( req, res, next) => {

    if(req.query.specific) {
        let specifics = req.query.specific.split(',').join("','");
        const admins = await DBselect('admins', '*', "id IN ('" + specifics + "')").catch(err => { sendError({status:400, response:res, message:err}); return false; });
        if(!admins) return;
        send(200, res, "success", admins, ['pass', 'password']);
        return;
    }
    const admins = await DBselect('admins', '*').catch(err => { sendError({status:400, response:res, message:err}); return false; });
    if(!admins) return;
    send(200, res, "success", admins, ['pass', 'password']);

};

const getAdmin = async ( req, res, next) => {

    console.log("req.params.id : ",req.url)
    const param = req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const admin = await DBselect('admins', '*', {id: req.params.id}).catch(err => { sendError({status:400, response:res, message:err}); return false; });
    if(!admin) return;
    send(200, res, "success", admin, ['pass', 'password']);
    
};

const createAdmin = async ( req, res, next) => {

    console.log(req.body);
    req.body.id = generateId();
    req.body.pass = req.body.password || req.body.pass;
    req.body.pass = await hash(req.body.pass);
    const admin = await DBinsert('admins', req.body).catch(err => { sendError({status:400, response:res, message:err}); return false; });
    if(!admin) return;
    send(201, res, "success", admin, ['pass', 'password']);

};

const updateAdmin = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    if(req.body.avatar?.length && req.body.avatar?.length > 0) req.body.avatar = req.body.avatar[0];
    if(req.body.avatar) {
        let fileName = await uploadFile(req.body.avatar, "avatar"+req.params.id, "files/avatar", 'image').catch(err => { sendError({status:400, response:res, message:err}); return false; });
        req.body.avatar = fileName;
    }
    const body = objectWithoutKey(req.body, 'pass');
    const admin = await DBupdate('admins', body, {id: req.params.id}).catch(err => { sendError({status:400, response:res, message:err}); return false; });
    if(!admin) return;
    send(200, res, "success", admin, ['pass', 'password']);
    
};
  
export {getAdmins, getAdmin, createAdmin, updateAdmin};