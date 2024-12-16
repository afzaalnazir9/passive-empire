import mongoose from "mongoose";

const gamesSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
    },
    logo: {
        type: String,
    },
    mobile_build: {
        type: String,
    },
    web_build_framework: {
        type: String,
    },
    web_build_wasm: {
        type: String,
    },
    web_build_loader: {
        type: String,
    },
    web_build_data: {
        type: String,
    },
}, {
    timestamps: true,
})

const Games = mongoose.model('Games', gamesSchema);
export default Games;