import { sendError } from '../middleware/error.js';

const getIndex = (req, res, next) => {
    res.send('Hello, World!');
};
  
export default getIndex;