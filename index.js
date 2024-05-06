import express from 'express';
import env from './src/config/index.js';
import { loggerMiddleware } from './src/middleware/logger.js';
import login from './src/routes/login.js';
import check from './src/routes/check.js';
import password from './src/routes/password.js';
import usersRouter from './src/routes/users.js';
import adminsRouter from './src/routes/admins.js';
import doctorsRouter from './src/routes/doctors.js';
import ratingsRouter from './src/routes/ratings.js';
import appointmentRouter from './src/routes/appointment.js';
import reportRouter from './src/routes/report.js';
import notificationRouter from './src/routes/notification.js';
import chatRouter from './src/routes/chat.js';
import scheduleRouter from './src/routes/schedule.js';
import ws from './src/routes/WS.js';
import files from './src/routes/files.js';
import {DBinit} from './src/database/index.js';
//import { createSocket } from './src/socket/index.js';
import { checkEnvFile } from './src/middleware/plugins.js';
import { randomBytes } from 'crypto';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import websocket from "websocket";
const { w3cwebsocket } = websocket;

// initialize database at the start of the server
// If you want to insert some data to the database at the begining, please set it like that :  DBinit(true);
// But be sure to set it to false after the first run, otherwise it will insert the same data again and again
DBinit(false);

// check .env file that should be in the folder 'src' and contain the following:
const envContent = {
    "HTTP_SERVER_HOST":"http://localhost:3000",
    "HTTP_SERVER_PORT":3000,
    "SERVER_SOCKET_HOST":"wss://graduationws.onrender.com",
    "SERVER_SOCKET_PORT":4000,
    "WEBSOCKET_TOKEN":"f427bc372cf4d5e4159a5be3250fd3f2cb2678fd966794956fc9a4aad10e3fbd",
    "ADMIN_TOKEN":"13cc665abb3b9d8a07e3211208e3a5a2c6106baa0c2354487a785fc6ef2be1219f4a042ea822fe4087bd4fd9a2614595",
    "PRIVATE_KEY":"339c8b3abddb0362c81fbaeada8414959066e45b46fde8384a8c62bc3b004f71",
    "DB_HOST":"sql.freedb.tech",
    "DB_PORT":3306,
    "DB_USER":"freedb_graduationhospitaladmin",
    "DB_PASS":"MYA!DxFBxTk6??9",
    "DB_NAME":"freedb_graduationhospital"
};

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the directory name from the file path

const envFile = path.join(__dirname, '.env');

checkEnvFile(envFile, envContent);

const PORT = env.port;

const app = express();

app.use(cors());

app.use('/src', express.static('src'));

app.use(loggerMiddleware);

const client = new w3cwebsocket(env.socketHost, null, env.host, {
    "authorization": "bearer " + env.systemToken,
});

client.onerror = function(error) {
    console.log('WebSocket: Connection Error', error);
};

client.onopen = function() {
    console.log('WebSocket: Client Connected successfully!');
};

client.onclose = function() {
    console.log('WebSocket: echo-protocol Client Closed');
};

app.use('/login', login);
app.use('/check', check);
app.use('/password', password);
app.use('/users', usersRouter);
app.use('/admins', adminsRouter);
app.use('/doctors', doctorsRouter);
app.use('/ratings', ratingsRouter);
app.use('/appointments', appointmentRouter);
app.use('/reports', reportRouter);
app.use('/notifications', notificationRouter);
app.use('/chat', chatRouter);
app.use('/schedules', scheduleRouter);
app.use('/files', files);
app.use('/sendEventWS', (req, res, next) => { req.ws = client;next() }, ws);

console.log("\n-------------------------------\n");
//createSocket(env.socketPort);

app.listen(PORT, () => {
    console.log(`# Server running at http://localhost:${PORT}/`);
    console.log("\n-------------------------------\n");
});
