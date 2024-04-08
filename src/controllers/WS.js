import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import env from '../config/index.js';

const sendWS = async ( req, res, next) => {

    const client = req.ws;

    console.log("headers : ", req.headers);

    const event = req.headers.Event || req.headers.event;
    let systemAuth = req.headers.wsAuth || req.headers.wsAuth;
    systemAuth = systemAuth?.replace(/Bearer/i, "").replace(/\s+/g, "");
    const data = req.body;

    console.log("Event : ", event);
    console.log("Data : ", data);
    console.log("System Auth : ", systemAuth);

    if(!event || !data || !systemAuth) {
        sendError({status:statusCodes.BAD_REQUEST, response:res, message:"Missing required parameters"});
        return;
    }

    if(systemAuth !== env.websocketToken) {
        sendError({status:statusCodes.UNAUTHORIZED, response:res, message:"Unauthorized"});
        return;
    }

    client.send(JSON.stringify({systemAuth, event, data}));
    send(200, res, "success", {message:"Event sent successfully"});

};

export { sendWS };