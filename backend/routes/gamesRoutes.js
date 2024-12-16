import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import upload from "../config/multer.js";
import {
    createGame,
    displayAllGames,
    deleteGame,
    updateGame,
} from "../controllers/gamesController.js";

const router = express.Router();

router.post("/create",
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'mobile_build', maxCount: 1 },
        { name: 'web_build_framework', maxCount: 1 },
        { name: 'web_build_wasm', maxCount: 1 },
        { name: 'web_build_loader', maxCount: 1 },
        { name: 'web_build_data', maxCount: 1 }
    ]), protect, createGame);

router.get("/getAllGames", displayAllGames);

router.delete("/delete/:gameId", protect, deleteGame);

router.put("/update/:gameId",
        upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'mobile_build', maxCount: 1 },
        { name: 'web_build_framework', maxCount: 1 },
        { name: 'web_build_wasm', maxCount: 1 },
        { name: 'web_build_loader', maxCount: 1 },
        { name: 'web_build_data', maxCount: 1 }
    ]),protect,
    updateGame
);
export default router