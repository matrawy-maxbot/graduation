import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the directory name from the file path

// Create a stream for morgan to write to, such as a file
const accessLogStream = fs.createWriteStream(path.join(__dirname, "../../", 'access.log'), { flags: 'a' });
const loggerMiddleware = morgan('combined', { stream: accessLogStream });

const accessLogErrorStream = fs.createWriteStream(path.join(__dirname, "../../", 'error.log'), { flags: 'a' });
const Errorlogger = async (error) => {
    accessLogErrorStream.write((new Date().format("[ YYYY-MM-DD hh:mm:ss a/p ]")) + " : " + error + "\n");
};

Date.prototype.format = function(format) {
    let date = this;
    return format.replace(/(YYYY|YY|MM|DD|E|hh|mm|ss|a\/p)/gi, function($1) {
        switch ($1) {
            case "YYYY":
                return date.getFullYear();
            case "YY":
                return (date.getFullYear() % 1000);
            case "MM":
                return (date.getMonth() + 1);
            case "DD":
                return date.getDate();
            case "E":
                return date.getDay();
            case "hh":
                {
                    let h = (date.getHours() % 12) ? (date.getHours() % 12) : date.getHours();
                    return (h < 10 ? "0" : "") + h;
                };
            case "mm":
                return (date.getMinutes() < 10 ? "0" : "") + date.getMinutes();
            case "ss":
                return (date.getSeconds() < 10 ? "0" : "") + date.getSeconds();
            case "a/p":
                return date.getHours() < 12 ? "AM" : "PM";
            default:
                return $1;
        }
    });
}

export { loggerMiddleware, Errorlogger };