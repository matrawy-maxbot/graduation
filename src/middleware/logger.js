import fs from 'fs';
import path from 'path';
import morgan from 'morgan';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the directory name from the file path

// Create a stream for morgan to write to, such as a file
const accessLogStream = fs.createWriteStream(path.join(__dirname, "../../", 'access.log'), { flags: 'a' });

const loggerMiddleware = morgan('combined', { stream: accessLogStream });

export default loggerMiddleware;