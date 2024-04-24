import statusCodes from '../config/status.js';
import { sendError } from './error.js';
import { openSync, writeFileSync, readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { DBselect } from '../database/index.js';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = dirname(__filename); // get the directory name from the file path

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

const checkEnvFile = (path, envObject) => { // anyKey is an key the will be checked if it exists in the .env file
    try {
        console.log("checkEnvFile: ", path, envObject)
        let envFile = readFile(path);
        console.log("envFile: ", envFile);
        if(!envFile) {
            createEnvFile(path, envObject);
            return;
        }
    }
    catch (error) {
        throw error;
    }
}

const createEnvFile = (path, env = {}) => {
    try {
        let envFile = '';
        for(let key in env) {
            envFile += `${key}=${env[key]}\n`;
        }
        createFile(path, envFile);
    } catch (error) {
        throw error;
    }
}

const createFile = (path, content) => {
    try {
        writeFileSync(path, content);
        console.log("File created successfully");
        } catch (error) {
        throw error;
    }
}

const readFile = (path) => {
    try {
        path = join(__dirname, path);
        const openFile = openSync(path, 'r');
        return readFileSync(openFile, 'utf8');
    } catch (error) {
        return false;
    }
}

const checkUnique = async (req, res, next, tables = [], key, value) => {

    if(!tables.length || tables.length == 0) {
        sendError({status: statusCodes.BAD_REQUEST, response:res, message: `No tables to check.`});
        return;
    }
    if(!key) {
        sendError({status: statusCodes.BAD_REQUEST, response:res, message: `No key to check.`});
        return;
    }
    if(!value) {
        if(req.body[key]) value = req.body[key];
        else if(req.params[key]) value = req.params[key];
        else {
            sendError({status: statusCodes.BAD_REQUEST, response:res, message: `No value to check.`});
            return;
        }
    }
    if(!Array.isArray(tables) || !tables.length) tables = [tables];

    console.log("tables to check: ", tables, " key: ", key, " value: ", value, {[key]: value});
    let found = false;
    for(let table of tables) {
        let data = await DBselect(table, key, {[key]: value}).catch(err => { sendError({status:statusCodes.INTERNAL_SERVER_ERROR, response:res, message:err}); return false; });
        console.log("data: ", data);
        if(data.length > 0) {
            found = true;
            break;
        }
    }
    if(found) {
        sendError({status: statusCodes.BAD_REQUEST, response:res, message: `This ${key} is already signed up. Please try another one.`});
        return;
    }
    next();
}

export {
    objectWithoutKey,
    requiredKeys,
    checkRequired,
    checkEnvFile,
    checkUnique
};