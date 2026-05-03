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
import prompts from 'prompts';
import path from 'path';
import { fileURLToPath } from 'url';


// access env variables
const PORT = process.env._PORT;
const DB_URI = process.env.DB_URI;
const ADMIN_USER = process.env.SOCKET_ADMIN_USER;
const ADMIN_PWD = process.env.SOCKET_ADMIN_PWD;
var SECRET_KEY = null;
const ALGORITHM = "aes-256-gcm";


// gets encryption key from user, call on server startup
async function promptKey() {
    const response = await prompts({
        type: "password",
        name: "key",
        message: "Enter SECRET_KEY",
        validate: val => {
            if (!val || val.trim() === "") return "Cannot be empty";
            return /^[0-9a-fA-F]{64}$/.test(val) ? true : "Must be 64 hex characters";
        }
    }, {
        onCancel: () => {
            console.error("Server startup cancelled.");
            process.exit(1);
        }
    });

    return Buffer.from(response.key, "hex");
}


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


// SERVER START
export async function init() {
    // get secret key from user
    SECRET_KEY = await promptKey();
    if (SECRET_KEY.length !== 32) {
        console.error("SECRET_KEY length incorrect.");
        process.exit(1);
    }

    // initialise express and socket server
    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: true,
            credentials: true,
            methods: ['GET', 'POST']
        }
    });

    // middleware
    app.use(express.json());
    app.use(morgan('common'));
    app.use(cors());

    // connect to database
    mongoose.connect(DB_URI).then(() => console.log("Connected to DB.")).catch(error => console.log(error));

    // EXPRESS API
    app.use('/api/file', fileRoutes);


    // SOCKET.IO FUNCTIONALITY
    io.on('connection', (socket) => {
        // on a request for a file from the user
        socket.on('get-file', async fileId => {

            // attempt to find and load file for client
            const loadFile = await findFile(fileId);
            if (loadFile) { // if file found successfully
                socket.join(fileId); // put the client in correct room
                socket.data.fileId = fileId; // store roomId
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


            // when cursor updates received
            socket.on('cursor-update', update => {
                const room = socket.data.fileId;
                if (!room) return;
                socket.broadcast.to(room).emit('cursor-update', { ...update, id: socket.id });
            });

            // handle user leaving a room
            socket.on('leave-file', () => {
                const room = socket.data.fileId;
                if (!room) return;
                socket.leave(room);
                socket.data.fileId = undefined;
                socket.to(room).emit('user-left', socket.id);
            });

            // let other clients know when someone disconnected
            socket.on('disconnect', () => {
                const room = socket.data.fileId;
                if (room) socket.to(room).emit('user-left', socket.id);
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


    // SERVE CLIENT FRONT-END
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const CLIENT_DIST = path.join(__dirname, '..', 'dist');
    app.use(express.static(CLIENT_DIST));

    // for all routes that aren't /api or socket serve the frontend
    app.get(/^\/(?!api|socket\.io).*/, (req, res, next) => {
        if (req.path.startsWith('/api') || req.path.startsWith('/socket.io')) return next();
        res.sendFile(path.join(CLIENT_DIST, 'index.html'));
    });


    // run server listening on set port
    httpServer.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}



if (import.meta.url === `file://${process.argv[1]}`) {
    init().catch(err => {
        console.error("Server startup failed:", err);
        process.exit(1);
    });
}