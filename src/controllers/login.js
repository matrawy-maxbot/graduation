import { sendError } from '../middleware/error.js';
import { generateToken } from '../middleware/authentication.js';
import { hash, compare } from '../middleware/hash.js';
import { DBselect, DBinsert, DBupdate } from '../database/index.js';

const login = async ( req, res, next) => {
    try {
        let { phone, pass, password } = req.body;

        const user = await checkUser(phone, "phone");
        console.log("User : ", user);

        password = pass || password;

        if(user) {
            const compr = await compare(password, user.pass);
            if(compr) {
                const JWTToken = generateToken({id: user.id});
                res.json({status:true, token:JWTToken});
            } else {
                res.json({status:false, error: "Password is incorrect"});
            }
        }
        else {
            res.json({status:false, error: "User not found"});
        }
    }
    catch (error) {
        console.error("Error : ", error);
        res.json({status:false, error: error?.message || error});
    }
}

const checkUser = async (value, key) => {
    try {
        let user = await DBselect('admins', '*', {[key]: value});
        let role = "admin";
        if(user.length == 0) {
            user = await DBselect('doctors', '*', {[key]: value});
            role = "doctor";
        }
        if(user.length == 0) {
            user = await DBselect('users', '*', {[key]: value});
            role = "user";
        }
        if(user.length == 0) {
            return false;
        }
        user[0].role = role;
        return user[0];
    }
    catch (error) {
        console.error("Error : ", error);
        return false;
    }
}   

export {login, checkUser};