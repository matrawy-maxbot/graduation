import { sendError } from '../middleware/error.js';

const getUsers = ( req, res, next) => {
    res.send('Users route: List of users');
};
  
export default getUsers;