import statusCodes from '../config/status.js';
import { sendError } from '../middleware/error.js';
import { send } from '../middleware/send.js';
import { readDirectory } from '../middleware/plugins.js';
import path from 'path';
import { fileURLToPath } from 'url';

const getAvatars = async ( req, res, next) => {

    const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
    const __dirname = path.dirname(__filename); // get the directory name from the file path

    const dirSrc = path.join(__dirname, "../../", 'src/files/avatar');
    let dir = readDirectory(dirSrc);

    console.log("dir: ", dir, __dirname, dirSrc);

    send(200, res, "success", dir);

}

const getFiles = async ( req, res, next) => {

    const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
    const __dirname = path.dirname(__filename); // get the directory name from the file path

    const dirSrc = path.join(__dirname, "../", 'files/chat');
    let dir = readDirectory(dirSrc);

    send(200, res, "success", dir);
    
}   

export { getAvatars, getFiles };