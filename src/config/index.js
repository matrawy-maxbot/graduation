import { config } from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the directory name from the file path

const envFile = path.join(__dirname, "../", '.env');

config({ path: envFile});

const _config = {
    port: process.env.HTTP_SERVER_PORT || 8080,
    host: process.env.HTTP_SERVER_HOST || 'localhost',
    db: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'test',
        port: process.env.DB_PORT || 3306
    },
    privateKEY: process.env.PRIVATE_KEY,
    systemToken: process.env.SYSTEM_TOKEN
};

export default _config;