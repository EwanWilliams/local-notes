import express from 'express';
import File from '../models/File.mjs';

const router = express.Router();


// create new file with given title and return the _id
router.post('/new', async (req, res) => {
    try {
        const newTitle = req.body.title;
        if (!newTitle) {
            res.status(400).json({error: "Bad request, title required."});
        } else {
            const newFile = await File.create({title: newTitle});
            res.status(201).json({fileId: newFile._id});
        }
    } catch (err) {
        console.error("New file error: ", err);
        res.status(500).json({ error: "Internal Server Error" });
    }
});


export default router;