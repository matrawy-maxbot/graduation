import env from '../config/index.js';
import { sendError } from './events.js';
import { verifyToken } from '../middleware/authentication.js';
import { checkLogin } from '../controllers/login.js';
import statusCodes from '../config/status.js';

const allowedOrigins = ["localhost:4000", "localhost:4001"];

function originIsAllowed(request, origin) {
    if(!origin) {
        sendError({status:statusCodes.BAD_REQUEST, message:"You should set origin to access"}, request);
        return false;
    }
    origin = origin.replace("http://", "").replace("https://", "");
    if(allowedOrigins.includes(origin)) return true;
    else {
        sendError({status:statusCodes.FORBIDDEN, message:"This origin is not allowed"}, request);
        return false;
    }
}

const checkAuthorization = async (request) => {
    return new Promise(async (resolve, reject) => {
        let auth = request.httpRequest.headers.authorization;
        if(!auth) {
            sendError({status:statusCodes.UNAUTHORIZED, message:"Unauthorized"}, request);
            reject(false);
        }
        const authToken = auth.replace(/Bearer/i, "").replace(/\s+/g, "");
        console.log("Socket Request Auth Token : ", authToken, env.systemToken);
        if(authToken == env.systemToken){
            sendError({status:statusCodes.FORBIDDEN, message:"You can not access the events by system token"}, request);
            reject(false);
        }
        const tkn = verifyToken(authToken);
        if(tkn.status) {
            let user = await checkLogin(tkn.data.id, "id");
            if(!user || user.length == 0) {
                sendError({status:statusCodes.NOT_FOUND, message:"User not found"}, request);
                reject(false);
            }
            resolve(user);
        } else {
            if(tkn.data === "Expired"){
                sendError({status:statusCodes.UNAUTHORIZED, message:"authorization Token is Expired"}, request);
                reject(false);
            } else {
                sendError({status:statusCodes.UNAUTHORIZED, message:"Unauthorized"}, request);
                reject(false);
            }
        }
    });
}

const checkRequest = async (request) => {
    return new Promise(async (resolve, reject) => {
        let origin = originIsAllowed(request, request.origin);
        if (!origin) {
            sendError({status:statusCodes.FORBIDDEN, message:"This origin is not allowed"}, request);
            reject(false);
        }
        let auth = await checkAuthorization(request).catch(err => {if(err) console.error(err);return false;});
        if(!auth) {
            sendError({status:statusCodes.UNAUTHORIZED, message:"Unauthorized"}, request);
            reject(false);
        }
        resolve({user:auth, origin:origin});
    });
}

export { checkRequest, originIsAllowed, checkAuthorization, allowedOrigins };