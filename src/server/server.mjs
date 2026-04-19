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
import File from './models/File.mjs';
import crypto from 'crypto';


// access env variables
const PORT = process.env._PORT;
const CLIENT = process.env._CLIENT_PORT;
const DB_URI = process.env.DB_URI;
const ADMIN_USER = process.env.SOCKET_ADMIN_USER;
const ADMIN_PWD = process.env.SOCKET_ADMIN_PWD;
const SECRET_KEY = Buffer.from(process.env.SECRET_KEY, "hex");
const ALGORITHM = "aes-256-gcm";


// encryption and decryption functions to be made avaliable to other modules
// encrypt plain text
function encryptField(plainText) {
    if (plainText == null || plainText === "") return plainText;
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv(ALGORITHM, SECRET_KEY, iv);
    const cipherText = Buffer.concat([cipher.update(String(plainText), "utf-8"), cipher.final()]);
    const authTag = cipher.getAuthTag();
    return Buffer.concat([iv, authTag, cipherText]).toString("base64");
}

// decrypt encoded text
function decryptField(encodedText) {
    if (encodedText == null || encodedText === "") return encodedText;
    const b = Buffer.from(encodedText, "base64");
    const iv = b.subarray(0, 12);
    const authTag = b.subarray(12, 28);
    const cipherText = b.subarray(28);
    const decipher = crypto.createDecipheriv(ALGORITHM, SECRET_KEY, iv);
    decipher.setAuthTag(authTag);
    return Buffer.concat([decipher.update(cipherText), decipher.final()]).toString("utf8");
}

export { encryptField, decryptField };

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


// get file from database
async function findFile(fileId) {
    try {
        const data = await File.findById(fileId);
        if (data) return data;
        return null;
    } catch (err) {
        console.error("Find file error: ", err);
        return null;
    }
} 


// SOCKET.IO FUNCTIONALITY
io.on('connection', (socket) => {
    // on a request for a file from the user
    socket.on('get-file', async fileId => {

        // attempt to find and load file for client
        const loadFile = await findFile(fileId);
        if (loadFile) { // if file found successfully
            socket.join(fileId); // put the client in correct room
            socket.emit('load-file', loadFile.data); // send the file
        } else {
            socket.emit('failed-load'); // tell the client load failed
        }

        // on receiving changes made by a user
        socket.on('user-changes', delta => {
            socket.broadcast.to(fileId).emit('new-changes', delta);
        });

        // save file to database when called
        socket.on('save-file', async data => {
            await File.findByIdAndUpdate(fileId, { data });
        });
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