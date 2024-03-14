import statusCodes from '../config/status.js';
import { sendError } from './error.js';

const objectWithoutKey = (object, key) => {
    const {[key]: deletedKey, ...otherKeys} = object;
    return otherKeys;
}

const requiredKeys = (object = {}, keys = []) => {
    console.log("requiredKeys: ", object, keys);
    object = object || {};
    return new Promise((resolve, reject) => {
        let missedKeys = [];
        
        for (let key of keys) {
            if(key.includes('||')) {
                let orKeys = key.split('||');
                let found = false;
                for(let orKey of orKeys) {
                    console.log("orKey: ", orKey, object[orKey]);
                    if(object[orKey] !== undefined) {
                        found = true;
                        break;
                    }
                }
                if(!found) missedKeys.push(key);
                continue;
            } else if (object[key] == undefined) missedKeys.push(key);
        }
        if(missedKeys.length > 0) {
            reject(missedKeys);
        }
        resolve(true);
    });
}

const checkRequired = async (req, res, next, keys = []) => {
    console.log("checking required keys: ", req.body, req.files);
    let rk = await requiredKeys(req.body, keys).catch((missedKeys) => {
        console.log("missed keys: ", missedKeys);
        sendError({status: statusCodes.BAD_REQUEST, response:res, message: `Missing required fields: ${missedKeys.join(', ')}`});
    });
    if(!rk) return;
    next();
}

export {
    objectWithoutKey,
    requiredKeys,
    checkRequired
};