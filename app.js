
const express = require('express');
const path = require('path')
const app = express();
const http = require('http');
const { Server } = require("socket.io");
const bodyParser = require('body-parser'); // bodyParser will deal with the request in 'post' method.
const cors = require('cors');
var admin = require("firebase-admin");

// Initialize Firebase Admin
var serviceAccount = require("./firebase-adminsdk.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});
const publicPath = path.join(__dirname, 'public')

// 'public' will contain static files that the server will use.
app.use(express.static(publicPath))

// app.use(express.static(publicPath, {
//     etag: false, 
//     lastModified: false,
//     setHeaders: (res, path) => {
//         if(express.static.mime.lookup(path) === 'text/html') {
//             // Custom Cash control for HTML file.
//             res.setHeader('Cache-Control', 'no-cache');
//         }
//     }
// }));


// Middleware setup
app.use(bodyParser.urlencoded({ extended: true}));
app.use(express.json()); // Deal with the information in json object. set it as a middleware.
app.use(cors()); // cors used as middleware.

// WebSocket setup
const server = http.createServer(app);
const io = new Server(server);
const messageService = require("./services/message");
messageService.setIo(io);

// Readiness probe endpoint
app.get('/readiness_check', (req, res) => {
    res.status(200).send('OK');
});



// Middleware to handle the redirection from /chat and /register to the login page
app.use((req, res, next) => {
    const { originalUrl, method } = req;
    if ((originalUrl === '/chat' || originalUrl === '/register') && method === 'GET') {
        res.redirect('/');
    } else {
        next();
    }
});

// If someone will request from the server api/Users using 'post' we will respond we creating a new user in the system.
const register = require('./routes/register')
// API that use to register user in the system.
app.use('/api/Users', register);


const login = require('./routes/login')
// API to log in user into the system.
app.use('/api/Tokens', login);

const InfoUser = require('./routes/InfoUser')
// // API to get user information.
app.use('/api/Users/:id', InfoUser);

const chat = require('./routes/chat');
app.use('/api/Chats', chat);


// const customEnv = require('custom-env');
// customEnv.env(process.env.NODE_ENV, './config');
//const port = process.env.PORT || 8080; // Use the google cloud provided port or default to 8080 for local development

const mongoose= require('mongoose');
// Connecting to the mongoose. mongoose will be located in 'CONNECTION_STRING'. This string is define in the config directory.
// need to swich instead of the hard codes server to - 'process.env.CONNECTION_STRING'
mongoose.connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('Conntect to mongoDB!'))


// 'process.env.PORT' varaible will contain the port that the server will run on it. This string is define in the config directory.
// need to swich instead of the hard coded port to - 'process.env.PORT
//server.listen(process.env.PORT)

// Start the server
const port = process.env.PORT || 8080;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

//"start": "cross-env NODE_ENV=cloud node app.js"

// CONNECTION_STRING="mongodb+srv://liadbrettler:khQ1rkq92yR1gCTl@cluster0.83mxj0h.mongodb.net/?retryWrites=true&w=majority"
// PORT=4005
// JWT_SECRET="Bearer  "