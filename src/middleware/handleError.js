import { sendError, handleError } from '../middleware/error.js';

const call = (callback) => {
    return (req, res, next) => {
        try {
            callback(req, res, next);
        } catch (error) {
            handleError({ status:error.status , message: error.message, data:error.data, response: res});
        }
    };
};
export { call };