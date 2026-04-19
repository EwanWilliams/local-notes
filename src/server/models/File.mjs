import mongoose from "mongoose";
import { encryptField, decryptField } from "../server.mjs";

const fileSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        set: encryptField,
        get: decryptField
    },
    data: {
        type: Object,
        default: ""
    }
}, {
    toObject: { getters: true },
    toJSON: { getters: true }
});


const File = mongoose.model('Files', fileSchema, 'Files');
export default File;