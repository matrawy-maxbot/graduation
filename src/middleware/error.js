import statusCodes from "../config/status.js";
import { Errorlogger } from "./logger.js";

class CustomError extends Error {
    constructor(status, message, data = {}) {
        super(message);
        this.status = status;
        this.data = data;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}

const logError = async (error) => {
    try {
        console.error("\n--------------------------------------------\n",
        `[${new Date().toISOString()}] Error status : ${error.status} - ${error.message}`,
        "\n--------------------------------------------\n");
        if(Object.keys(error.data).length > 0) console.error('Additional Data:', error.data, "\n");
        console.error(error.stack);
    } catch (error) {
        console.error("Error in logError function: ", error);
        Errorlogger(error);
    }
};

const writeError = async (response, status, message) => {
    try {
        return new Promise((resolve, reject) => {
            response.status(status).write(JSON.stringify({ status:status, error: message }));
            resolve();
        });
    } catch (error) {
        console.error("Error in writeError function: ", error);
        Errorlogger(error);
    }
}

const sendError = async (options) => {
    try {
        let { status = statusCodes.INTERNAL_SERVER_ERROR, message = 'Internal Server Error', data = {}, log = true, response } = options;
        message = message.toString();
        if(message.split("#").length > 1) {
            status = Number.parseInt(message.split("#")[0], 10);
            message = message.split("#")[1];
        }
        const error = new CustomError(status, message, data);
        if (log) {
            logError(error);
            Errorlogger(status + " # " + error);
        }
        if(response) {
            await writeError(response, status, message);
            response.end();
        }
    } catch (error) {
        console.error("Error in sendError function: ", error);
        Errorlogger(error);
    }
};

const handleError = async (options) => {
    try {
        const { status = statusCodes.INTERNAL_SERVER_ERROR, message = 'Internal Server Error', data = {}, log = true, response } = options;
        const error = new CustomError(status, message, data);
        if (log) {
            logError(error);
            Errorlogger(status + " # " + error);
        }
        if(response) {
            await writeError(response, status, message);
            response.end();
        }
    } catch (error) {
        console.error("Error in handleError function: ", error);
        Errorlogger(error);
    }
}

export {sendError, handleError};
  