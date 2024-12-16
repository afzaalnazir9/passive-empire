
import express from "express"
import { protect } from "../middleware/authMiddleware.js"
import { createBundle, getAllBundles, deleteBundle, updateBundle } from "../controllers/bundleController.js";

const router = express.Router();

router.post("/create", protect, createBundle)
router.get("/getAllBundles", protect, getAllBundles)
router.delete("/delete/:bundleId", protect, deleteBundle)
router.put("/update/:bundleId", protect, updateBundle)


export default router