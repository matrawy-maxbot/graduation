import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { generateToken } from '../middleware/authentication.js';
import { compare } from '../middleware/hash.js';
import { DBselect } from '../database/index.js';

const login = async ( req, res, next) => {

    let { phone, pass, password } = req.body;
    password = pass || password;
    const user = await checkLogin(phone, "phone", res);
    console.log("User : ", user);
    if(user) {
        console.log("password : ", password, user.pass);
        const compr = await compare(password, user.pass);
        console.log("compr : ", compr)
        if(compr) {
            const JWTToken = generateToken({id: user.id});
            send(200, res, "success", {token:JWTToken});
        } else {
            sendError({status: statusCodes.UNAUTHORIZED, response:res, message: "Password is incorrect"});
        }
    } else {
        sendError({status: statusCodes.NOT_FOUND, response:res, message: "User not found"});
    }

}

const checkLogin = async (value, key, res = undefined) => {

    try {

        let user = await DBselect('admins', '*', {[key]: value}).catch(err => {throw err});
        if(!user) return false;
        let role = "admin";
        if(user.length == 0) {
            user = await DBselect('doctors', '*', {[key]: value}).catch(err => {throw err});
            if(!user) return false;
            role = "doctor";
        }
        if(user.length == 0) {
            user = await DBselect('users', '*', {[key]: value}).catch(err => {throw err});
            if(!user) return false;
            role = "user";
        }
        if(user.length == 0) {
            return false;
        }
        user[0].role = role;
        return user[0];
        
    } catch (error) {

        console.error(error);
        if(res) sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:error});
        return false;
        
    }
    
}   

export {login, checkLogin};