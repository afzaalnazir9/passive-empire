import cors from "cors";
import express from "express";
import dotenv from "dotenv";
dotenv.config();
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import userRoutes from "./routes/userRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import gamesRoutes from "./routes/gamesRoutes.js"
import bundleRoutes from "./routes/bundleRoutes.js"
import logger from "morgan"
import path from "path"

const port = process.env.PORT || 5000;

const connectToDatabase = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected successfully.");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

const app = express();

app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(logger("dev"))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

const __dirname = path.dirname(new URL(import.meta.url).pathname);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use("/users", userRoutes);
app.use("/payment", paymentRoutes);
app.use("/games", gamesRoutes)
app.use("/bundles", bundleRoutes)
app.get("/config", (req, res) => {
  res.send({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
  });
});

app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, async () => {
  console.log(`Server started on port ${port}`);
  await connectToDatabase();
})
