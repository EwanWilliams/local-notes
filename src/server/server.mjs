import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { Server } from 'socket.io';


const app = express();
const PORT = process.env.PORT;


// middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());


// test API call
app.get('/test', (req, res) => {
    res.status(200).json({message: "this message came from the server"});
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));