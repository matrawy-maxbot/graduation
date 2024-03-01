import express from 'express';
import env from './src/config/index.js';
import loggerMiddleware from './src/middleware/logger.js';
import usersRouter from './src/routes/users.js';
import adminsRouter from './src/routes/admins.js';
import doctorsRouter from './src/routes/doctors.js';
import ratingsRouter from './src/routes/ratings.js';
import appointmentRouter from './src/routes/appointment.js';
import reportRouter from './src/routes/report.js';
import notificationRouter from './src/routes/notification.js';
import chatRouter from './src/routes/chat.js';
import scheduleRouter from './src/routes/schedule.js';

const app = express();

app.use(loggerMiddleware);

app.use('/users', usersRouter);
app.use('/admins', adminsRouter);
app.use('/doctors', doctorsRouter);
app.use('/ratings', ratingsRouter);
app.use('/appointments', appointmentRouter);
app.use('/reports', reportRouter);
app.use('/notifications', notificationRouter);
app.use('/chat', chatRouter);
app.use('/schedules', scheduleRouter);

const PORT = env.port || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
