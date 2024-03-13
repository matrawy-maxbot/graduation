import { handleError } from '../middleware/error.js';

const call = (callback, ...args) => {
    return async (req, res, next) => {
        try {
            await callback(req, res, next, ...args);
        } catch (error) {
            handleError({ status:error.status , message: error.message, data:error.data, response: res});
        }
    };
};
export { call };