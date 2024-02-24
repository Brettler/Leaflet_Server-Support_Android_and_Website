const express = require('express');
const app = express();

const http = require('http');
const { Server } = require("socket.io");

const server = http.createServer(app);
const io = new Server(server);

const messageService = require("./services/message");
messageService.setIo(io);

// bodyParser will deal with the request in 'post' method.
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true}));
// Deal with the information in json object. set it as a middleware.
app.use(express.json());

// cors used as middleware.
const cors = require('cors');
app.use(cors());


// Middleware to handle the redirection from /chat and /register to the login page
app.use((req, res, next) => {
    const { originalUrl, method } = req;
    if ((originalUrl === '/chat' || originalUrl === '/register') && method === 'GET') {
        res.redirect('/');
    } else {
        next();
    }
});

var admin = require("firebase-admin");

var serviceAccount = require("./firebase-adminsdk.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});


const customEnv = require('custom-env');
customEnv.env(process.env.NODE_ENV, './config');

const mongoose= require('mongoose');
// Connecting to the mongoose. mongoose will be located in 'CONNECTION_STRING'. This string is define in the config directory.
// need to swich instead of the hard codes server to - 'process.env.CONNECTION_STRING'
mongoose.connect(process.env.CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });

// Settings to the server:
// 'public' will contain static files that the server will use.
app.use(express.static('public'))

// If someone will request from the server api/Users using 'post' we will respond we creating a new user in the system.
const register = require('./routes/register')
// API that use to register user in the system.
app.use('/api/Users', register);


const login = require('./routes/login')
// API to log in user into the system.
app.use('/api/Tokens', login);

const userInfo = require('./routes/UserInfo')
// // API to get user information.
app.use('/api/Users/:id', userInfo);

const chat = require('./routes/chat');
app.use('/api/Chats', chat);

// 'process.env.PORT' varaible will contain the port that the server will run on it. This string is define in the config directory.
// need to swich instead of the hard coded port to - 'process.env.PORT
server.listen(process.env.PORT)

// const port = process.env.PORT || 3000; // Use the Elastic Beanstalk provided port or default to 3000 for local development
// server.listen(port, () => {
//   console.log(`Server is running on port ${port}`);
// });
