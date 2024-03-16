import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import jwt from 'jsonwebtoken';
import env from '../config/index.js';
import { checkLogin } from '../controllers/login.js';

const generateToken = (payload, expire) => {
    const privateKey = env.privateKEY;
    return jwt.sign(payload, privateKey, { expiresIn: expire || '1d'}).split('.').slice(1).join('.');
}

const verifyToken = (token) => {
    try {
        token = token.replace(/Bearer/i, "").replace(/\s+/g, "");
        const header = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9";
        const privateKey = env.privateKEY;
        const tkn = jwt.verify(header + "." + token, privateKey);
        return {status:true, data:tkn};
    } catch (error) {
        let errorMessage = "";
        if(error.toString().includes("jwt expired")){

            errorMessage = "Expired";
        } else {
            errorMessage = error;
        }
        return {status:false, data:errorMessage};
    }
}

const checkToken = async ( req, res, next) => {

    const authToken = req.headers.authorization.replace(/Bearer/i, "").replace(/\s+/g, "");
    console.log("Auth Token : ", authToken, env.systemToken);
    if(authToken == env.systemToken){
        console.log("Token adminSystem ");
        next();
        return false;
    }
    const tkn = verifyToken(authToken);
    console.log("Token : ", tkn);
    if(tkn.status) {
        next();
    } else {
        if(tkn.data === "Expired"){
            res.status(statusCodes.BAD_GATEWAY).send("Token Expired");
        } else {
            console.log("leeeeeeeeeeh");
            res.status(statusCodes.UNAUTHORIZED).send("Unauthorized");
        }
    }
}

const checkRole = async ( req, res, next, role) => {
    const authToken = req.headers.authorization.replace(/Bearer/i, "").replace(/\s+/g, "");
    const tkn = verifyToken(authToken);
    if(tkn.status || authToken == env.systemToken) {
        if(!role) {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send("internal server");
            return false;
        }
        let user = await checkLogin(tkn.data.id, "id", res);
        if(user.length == 0) {
            res.status(statusCodes.NOT_FOUND).send("User not found");
            return false;
        }
        console.log("Role : ", role, "User : ", user)
        if(authToken == env.systemToken) {
            const url = req.originalUrl.split("/");
            if(url.includes("me") || role.includes("unsystem")) {
                sendError({ status: statusCodes.FORBIDDEN, message: 'cannot access this route with system token', response:res });
                return false;
            }
            next();
            return false;
        }
        if(typeof role == "array" || typeof role == "object") {
            if(role.includes(user.role) || role.includes("all")) {
                req.owner = user;
                next();
            } else {
                res.status(statusCodes.UNAUTHORIZED).send("Unauthorized");
            }
        } else if(typeof role == "string") {
            if(role == "all") {
                req.owner = user;
                next();
            } else if(user.role == role) {
                console.log("Role : ", role, "User : ", user.role)
                req.owner = user;
                next();
            } else {
                res.status(statusCodes.UNAUTHORIZED).send("Unauthorized");
            }
        } else {
            res.status(statusCodes.INTERNAL_SERVER_ERROR).send("internal server");
        }
    } else {
        if(tkn.data === "Expired"){
            res.status(statusCodes.BAD_GATEWAY).send("Token Expired");
        } else {
            res.status(statusCodes.UNAUTHORIZED).send("Unauthorized");
        }
    }
}

export {
    generateToken,
    verifyToken,
    checkToken,
    checkRole
};