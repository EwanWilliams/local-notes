import express from 'express';
import File from '../models/File.mjs';

const router = express.Router();


router.post('/new', async (req, res) => {
    const newTitle = req.body.title;
    
});


export default router;