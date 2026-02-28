import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';


const app = express();
const PORT = process.env._PORT;


// middleware
app.use(express.json());
app.use(morgan('dev'));


// test API call
app.get('/test', (req, res) => {
    res.status(200).json({message: "this message came from the server"});
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));