import statusCodes from '../config/status.js';
import env from '../config/index.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { checkAccountData } from '../controllers/login.js';
import { compare, hash } from '../middleware/hash.js';
import { DBupdate } from '../database/index.js';

const resetPassword = async ( req, res, next) => {

    let { oldpassword, newpassword } = req.body;

    const user = await checkAccountData(req.owner.id, "id", res);
    if(user) {
        console.log("password : ", oldpassword, user.pass);
        const compr = await compare(oldpassword, user.pass);
        if(compr) {
            newpassword = await hash(newpassword);
            let updateTable = "users";
            if(user.role == "admin") updateTable = "admins";
            if(user.role == "doctor") updateTable = "doctors";
            const update = await DBupdate(updateTable, {pass: newpassword}, {id: req.owner.id}).catch(err => {throw err});
            if(update) {
                send(200, res, "success", "Password reset successfully");
            } else {
                sendError({status: statusCodes.INTERNAL_SERVER_ERROR, response: res, message: "Failed to reset password"});
            }
        } else {
            sendError({status: statusCodes.UNAUTHORIZED, response: res, message: "Password is incorrect"});
        }
    } else {
        sendError({status: statusCodes.NOT_FOUND, response: res, message: "User or account is not found"});
    }
    
}

const forgetPassword = async ( req, res, next) => {

    let { newpassword } = req.body;

    let user = await checkAccountData(req.params.id, "id", res);
    if(!user) {
        sendError({status: statusCodes.NOT_FOUND, response: res, message: "User or account is not found"});
        return;
    }

    newpassword = await hash(newpassword);
    let updateTable = "users";
    if(user.role == "admin") updateTable = "admins";
    if(user.role == "doctor") updateTable = "doctors";
    const update = await DBupdate(updateTable, {pass: newpassword}, {id: req.params.id}).catch(err => {throw err});
    if(update) {
        send(200, res, "success", "Password reset successfully");
    } else {
        sendError({status: statusCodes.INTERNAL_SERVER_ERROR, response: res, message: "Failed to reset password"});
    }
    
}

export { resetPassword, forgetPassword };