import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import PaytabsController from "../controllers/paytabsController.js";

const router = express.Router();
router.post("/create-subscription", protect, PaytabsController.createPayment);

router.post("/callback", PaytabsController.handlePostCallback)

router.post("/response", PaytabsController.serverResponse)


export default router;
