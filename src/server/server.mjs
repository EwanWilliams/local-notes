import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import { createServer } from 'http';
import morgan from 'morgan';
import cors from 'cors';
import { Server } from 'socket.io';
import { instrument } from '@socket.io/admin-ui';
import mongoose from 'mongoose';
import fileRoutes from './routes/file.mjs';


// access env variables
const PORT = process.env._PORT;
const CLIENT = process.env._CLIENT_PORT;
const DB_URI = process.env.DB_URI;
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


// connect to database
mongoose.connect(DB_URI).then(() => console.log("Connected to DB.")).catch(error => console.log(error));


// EXPRESS API
app.use('/api/file', fileRoutes);


// SOCKET.IO FUNCTIONALITY
io.on('connection', (socket) => {
    // on receiving changes made by a user
    socket.on('user-changes', delta => {
        socket.broadcast.emit('new-changes', delta);
    });
});


// use socket.io admin dashboard
instrument(io, {
    auth: {
        type: 'basic',
        username: ADMIN_USER,
        password: ADMIN_PWD
    },
    mode: 'development',
});


// run server listening on set port
httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));