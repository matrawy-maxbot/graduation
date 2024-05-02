import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { DBinsert, DBselect, DBupdate, DBdelete, uploadFile } from '../database/index.js';
import { generateId } from '../middleware/id.js';
import { hash } from '../middleware/hash.js';
import { objectWithoutKey } from '../middleware/plugins.js';
import { getUsersRatings, getUserRatings } from './ratings.js';

const getUsers = async ( req, res, next) => {

    let users;
    if(req.query.specific) {
        let specifics = req.query.specific.split(',').join("','");
        users = await DBselect('users', '*', "id IN ('" + specifics + "')").catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!users) return;
    } else {
        users = await DBselect('users', '*').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        if(!users) return;
    }
    const ratings = await getUsersRatings(req, res, next, false);
    console.log(ratings);
    users.forEach(user => {
        users.filter(u => u.id == user.id)[0].ratings = ratings.filter(r => r.user_id == user.id);
    });
    send(200, res, "success", users, ['pass', 'password']);

};

const getUser = async ( req, res, next) => {

    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    const users = await DBselect('users', '*', {id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!users) return;
    const ratings = await getUserRatings(req, res, next, false);
    const user = ratings.filter(r => r.user_id == users[0].id);
    users[0].ratings = user;
    send(200, res, "success", users, ['pass', 'password']);
    
};

const createUser = async ( req, res, next) => {

    console.log(req.body);
    req.body.id = generateId();
    req.body.pass = req.body.password || req.body.pass;
    if(req.body.pass) req.body.pass = await hash(req.body.pass);
    const users = await DBinsert('users', req.body).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!users) return;
    send(201, res, "success", users, ['pass', 'password']);

};

const updateUser = async ( req, res, next) => {
    
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    if(req.body.avatar?.length && req.body.avatar?.length > 0) req.body.avatar = req.body.avatar[0];
    if(req.body.avatar) {
        let fileName = await uploadFile(req.body.avatar, "avatar"+req.params.id, "files/avatar", 'image').catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        req.body.avatar = fileName;
    }
    const body = objectWithoutKey(req.body, 'pass');
    const users = await DBupdate('users', body, {id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!users) return;
    send(200, res, "success", users, ['pass', 'password']);
    
};

const deleteUser = async ( req, res, next) => {
    const param = req.url.split("/").includes("me") ? "me" : req.url.split("/")[1];
    if(param == "me") {
        req.params.id = req.owner.id;
    }
    let id = req.params.id;
    const users = await DBdelete('users', {id: id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!users) return;
    send(200, res, "success");
};

const checkUser = async ( req, res, next) => {
    const user = await DBselect('users', '*', {id: req.params.id}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
    if(!user) return;
    if(user.length == 0) sendError({status: statusCodes.NOT_FOUND, response:res, message: "User not found"});
    next();
};
  
export {getUsers, getUser, createUser, updateUser, deleteUser, checkUser};