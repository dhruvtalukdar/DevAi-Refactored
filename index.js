import express from "express";
import cors from "cors";
import { connectDb } from "./config/mongoose-connection.js";

// importing the routes
import genAiRoute from "./routes/genAi.route.js";
import authRoute from "./routes/auth.route.js";

// using dotenv globally 
import dotenv from "dotenv";
dotenv.config();


const port = process.env.PORT || 3000;
const app = express();
app.use(express.json());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);

// Routes
app.use('/auth', authRoute);
app.use("/genai", genAiRoute);


app.use('/', (req, res) => {
  res.status(200).json({ message: "Running"});
})

app.listen(port, () => {
  connectDb();
  console.log("Server running on 3000");
});