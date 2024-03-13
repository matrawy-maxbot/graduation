import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { generateToken } from '../middleware/authentication.js';
import { compare } from '../middleware/hash.js';
import { DBselect } from '../database/index.js';

const login = async ( req, res, next) => {

    let { phone, pass, password } = req.body;
    password = pass || password;
    const user = await checkLogin(phone, "phone");
    console.log("User : ", user);
    if(user) {
        console.log("password : ", password, user.pass);
        const compr = await compare(password, user.pass);
        console.log("compr : ", compr)
        if(compr) {
            const JWTToken = generateToken({id: user.id});
            send(200, res, "success", {token:JWTToken});
        } else {
            sendError({status: 401, response:res, message: "Password is incorrect"});
        }
    } else {
        sendError({status: 404, response:res, message: "User not found"});
    }

}

const checkLogin = async (value, key) => {

    try {

        let user = await DBselect('admins', '*', {[key]: value}).catch(err => { sendError({status:400, response:res, message:err}); return false; });
        if(!user) return false;
        let role = "admin";
        if(user.length == 0) {
            user = await DBselect('doctors', '*', {[key]: value}).catch(err => { sendError({status:400, response:res, message:err}); return false; });
            if(!user) return false;
            role = "doctor";
        }
        if(user.length == 0) {
            user = await DBselect('users', '*', {[key]: value}).catch(err => { sendError({status:400, response:res, message:err}); return false; });
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
        return false;
        
    }
    
}   

export {login, checkLogin};