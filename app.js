const cors = require('cors');
const express = require('express');
const app = express();
const userRouter = require('./routers/users');
const taskRouter = require('./routers/tasks');
const loginRouter = require('./routers/login');
const config = require('./utils/config');
const mongoose = require('mongoose');
const middleware = require('./utils/middleware');

console.log('connecting to mongdb');

mongoose.connect(config.MONGODB_URI)
    .then(() => console.log('connected to mongodb'))
    .catch(() => {
        console.log('[ERROR] when trying to connect to mongodb');
    });  

app.use(cors());
app.use(express.json());
app.use(middleware.tokenExtractor);
app.use(express.static('./build'));

app.use('/api/user',userRouter);
app.use('/api/task',taskRouter);
app.use('/api/login',loginRouter);

module.exports = app;