import express from 'express';
import env from './src/config/index.js';
import { loggerMiddleware } from './src/middleware/logger.js';
import login from './src/routes/login.js';
import usersRouter from './src/routes/users.js';
import adminsRouter from './src/routes/admins.js';
import doctorsRouter from './src/routes/doctors.js';
import ratingsRouter from './src/routes/ratings.js';
import appointmentRouter from './src/routes/appointment.js';
import reportRouter from './src/routes/report.js';
import notificationRouter from './src/routes/notification.js';
import chatRouter from './src/routes/chat.js';
import scheduleRouter from './src/routes/schedule.js';
import {DBinit} from './src/database/index.js';
import { createSocket } from './src/socket/index.js';
import { checkEnvFile } from './src/middleware/plugins.js';
import { randomBytes } from 'crypto';

// initialize database at the start of the server
// If you want to insert some data to the database at the begining, please set it like that :  DBinit(true);
// But be sure to set it to false after the first run, otherwise it will insert the same data again and again
DBinit(false);

// check .env file that should be in the folder 'src' and contain the following:
const envContent = {
    "HTTP_SERVER_HOST":"localhost",
    "HTTP_SERVER_PORT":8080,
    "SERVER_SOCKET_PORT":4000,
    "ADMIN_TOKEN":randomBytes(48).toString('hex'),
    "PRIVATE_KEY":randomBytes(32).toString('hex'),
    "DB_HOST":"localhost",
    "DB_PORT":3306,
    "DB_USER":"root",
    "DB_PASS":'',
    "DB_NAME":"graduation_project"
};
checkEnvFile("./src/.env", envContent);

const app = express();

app.use(loggerMiddleware);

app.use('/login', login);
app.use('/users', usersRouter);
app.use('/admins', adminsRouter);
app.use('/doctors', doctorsRouter);
app.use('/ratings', ratingsRouter);
app.use('/appointments', appointmentRouter);
app.use('/reports', reportRouter);
app.use('/notifications', notificationRouter);
app.use('/chat', chatRouter);
app.use('/schedules', scheduleRouter);

console.log("\n-------------------------------\n");
createSocket(env.socketPort);

const PORT = env.port;
app.listen(PORT, () => {
    console.log(`# Server running at http://localhost:${PORT}/`);
    console.log("\n-------------------------------\n");
});
