import express from 'express';
import env from './src/config/index.js';
import loggerMiddleware from './src/middleware/logger.js';
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

// initialize database at the start of the server (optional)
// If you used this function, you don't need to call it again in the code to get no errors
//DBinit();

// To send more than one you should encode the query parameter 'specific'
// like that encodeURIComponent('specific=1,2,3,4,5') or encodeURIComponent('1,2,3,4,5')

// .env file should be in the folder 'src' and contain the following:
/*
    HTTP_SERVER_HOST=localhost
    HTTP_SERVER_PORT=8080
    SERVER_SOCKET_PORT=4000
    ADMIN_TOKEN=BchhWoRKBNsjNiCLsB7ARUfA6qjbZu7bdbbczI1j7JmJ9coIBavC80Vy2xzTAOOCJslJnCMXRHWsNDjoWUA
    PRIVATE_KEY=ieorauyvpoieamjyvoeradlkwekdsfvcblojerglkfdxjy3gh4hgfh54htutk6
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASS=''
    DB_NAME=graduation_project
*/ 

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

createSocket(env.socketPort);

const PORT = env.port;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
