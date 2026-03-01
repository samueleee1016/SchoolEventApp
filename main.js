const express = require('express');
const app = express();
const http = require('http');
const path = require('path');
const routes = require('./routes/routes');
const {initWebSocket} = require('./ws/socket');
const errorHandler = require('./middlewares/error.middleware');
const HttpError = require('./errors/httpError');
require('dotenv').config();
const globalLimiter = require('./middlewares/rateLimiter.function').globalLimiter;

const server = http.createServer(app);
initWebSocket(server);

app.use(globalLimiter);

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('public'));
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', routes);
app.use(errorHandler);

const {SERVER_PORT} = process.env;
if(!SERVER_PORT)
    throw new HttpError("missing port");
server.listen(SERVER_PORT, () => {
    console.log('Server running correctly on port', SERVER_PORT);
});