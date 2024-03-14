import statusCodes from "../config/status.js";

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
    console.error("\n--------------------------------------------\n",
    `[${new Date().toISOString()}] Error status : ${error.status} - ${error.message}`,
    "\n--------------------------------------------\n");
    if(Object.keys(error.data).length > 0) console.error('Additional Data:', error.data, "\n");
    console.error(error.stack);
};

const writeError = async (response, status, message) => {
 return new Promise((resolve, reject) => {
    response.status(status).write(JSON.stringify({ status:status, error: message }));
    resolve();
 });
}

const sendError = async (options) => {
    let { status = statusCodes.INTERNAL_SERVER_ERROR, message = 'Internal Server Error', data = {}, log = true, response } = options;
    if(message.split("#").length > 1) {
        status = Number.parseInt(message.split("#")[0], 10);
        message = message.split("#")[1];
    }
    const error = new CustomError(status, message, data);
    if (log) {
        logError(error);
    }
    if(response) {
        await writeError(response, status, message);
        response.end();
    }
};

const handleError = async (options) => {
    const { status = statusCodes.INTERNAL_SERVER_ERROR, message = 'Internal Server Error', data = {}, log = true, response } = options;
    const error = new CustomError(status, message, data);
    if (log) {
        logError(error);
    }
    if(response) {
        await writeError(response, status, message);
        response.end();
    }
}

/*

// Usage examples:


// Basic usage
sendError({ status: 404, message: 'Resource not found', response: res });


// With additional data and no logging
sendError({
    status: 403,
    message: 'Permission denied',
    data: { user: 'john_doe' },
    log: false,
    response: res
});


// Using defaults
sendError({response: res});

*/

export {sendError, handleError};
  