import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the directory name from the file path

const envFile = path.join(__dirname, "../", '.env');

config({ path: envFile});

const _config = {
    port: process.env.HTTP_SERVER_PORT || 8080,
};

export default _config;