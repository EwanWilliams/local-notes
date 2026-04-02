import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import cors from 'cors';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';


// access env variables
const PORT = process.env._PORT;
const CLIENT = process.env._CLIENT_PORT;
const ADMIN_USER = process.env.SOCKET_ADMIN_USER;
const ADMIN_PWD = process.env.SOCKET_ADMIN_PWD;


// initialise express and socket server
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: [`http://localhost:${CLIENT}`, 'https://admin.socket.io'],
        credentials: true,
        methods: ['GET', 'POST']
    }
});


// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());


// EXPRESS API
app.get('/test', (req, res) => {
    res.status(200).json({message: "this message came from the server"});
});

// run server listening on set port
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// SOCKET.IO FUNCTIONALITY
io.on('connection', (socket) => {
    // on receiving changes made by a user
    socket.on('user-changes', delta => {
        socket.broadcast.emit('new-changes', delta);
    });
});


instrument(io, {
    auth: {
        type: 'basic',
        username: ADMIN_USER,
        password: ADMIN_PWD
    },
    mode: 'development',
});