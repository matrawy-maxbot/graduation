import express from 'express';
import env from './src/config/index.js';
import loggerMiddleware from './src/middleware/logger.js';
import indexRouter from './src/routes/index.js';
import usersRouter from './src/routes/users.js';

const app = express();

app.use(loggerMiddleware);

app.use('/', indexRouter);
app.use('/users', usersRouter);

const PORT = env.port;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
});
