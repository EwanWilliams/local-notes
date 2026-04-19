import mongoose from "mongoose";
import { encryptField, decryptField } from "../server.mjs";


function encryptFileText(data) {
    if (!data) return data;
    const out = JSON.parse(JSON.stringify(data));
    if (!Array.isArray(out.ops)) return out;

    for (let i = 0; i < out.ops.length; i++) {
        const op = out.ops[i];
        if (op && typeof op.insert === "string" && op.insert !== "") {
            out.ops[i].insert = encryptField(op.insert);
        }
    }
    return out;
}


function decryptFileText(data) {
    if (!data) return data;
    const out = JSON.parse(JSON.stringify(data));
    if (!Array.isArray(out.ops)) return out;

    for (let i = 0; i < out.ops.length; i++) {
        const op = out.ops[i];
        if (op && typeof op.insert === "string" && op.insert !== "") {
            out.ops[i].insert = decryptField(op.insert);
        }
    }
    return out;
}

const fileSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        set: encryptField,
        get: decryptField
    },
    data: {
        type: Object,
        set: encryptFileText,
        get: decryptFileText,
        default: {}
    }
}, {
    toObject: { getters: true },
    toJSON: { getters: true }
});


const File = mongoose.model('Files', fileSchema, 'Files');
export default File;