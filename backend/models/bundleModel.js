import mongoose from "mongoose";

const bundleSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    credits: {
        type: Number,
        required: true,
    },
}, {
    timestamps: true,
})

const Bundle = mongoose.model('Bundle', bundleSchema);
export default Bundle;