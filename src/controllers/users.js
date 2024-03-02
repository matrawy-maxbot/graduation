import { sendError } from '../middleware/error.js';
import { DBinsert, DBselect, DBupdate, DBdelete } from '../database/index.js';
import { getUsersRatings, getUserRatings } from './ratings.js';

const getUsers = async ( req, res, next) => {

    let users;
    if(req.query.specific) {
        let specifics = req.query.specific.split(',').join("','");
        users = await DBselect('users', '*', "id IN ('" + specifics + "')");
    } else {
        users = await DBselect('users', '*');
    }
    const ratings = await getUsersRatings(req, res, next, false);
    console.log(ratings);
    users.forEach(user => {
        users.filter(u => u.id == user.id)[0].ratings = ratings.filter(r => r.user_id == user.id);
    });
    res.json(users);

};

const getUser = async ( req, res, next) => {

    const users = await DBselect('users', '*', {id: req.params.id});
    const ratings = await getUserRatings(req, res, next, false);
    const user = ratings.filter(r => r.user_id == users[0].id);
    users[0].ratings = user;
    res.json(users);
    
};

const createUser = async ( req, res, next) => {

    console.log(req.body);
    const users = await DBinsert('users', req.body);
    res.json(users);

};

const updateUser = async ( req, res, next) => {
    
    const users = await DBupdate('users', req.body, {id: req.params.id});
    res.json(users);
    
};

const deleteUser = async ( req, res, next) => {
    let id = "";
    if(req.params.id) {
        id = req.params.id;
    } else {
        id = "22223";
    }
    const users = await DBdelete('users', {id: id});
    res.json(users);
};
  
export {getUsers, getUser, createUser, updateUser, deleteUser};