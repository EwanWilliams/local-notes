import mongoose from "mongoose";

const fileSchema = new mongoose.Schema({
    title: {
        type: String,
        maxLength: 50,
        required: true
    },
    data: {
        type: Object,
        default: ""
    }
});

const File = mongoose.model('Files', fileSchema, 'Files');
export default File;