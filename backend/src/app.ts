import dotenv from "dotenv";
dotenv.config();
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import userRouter from "./routers/user.router";
import { dbConnect } from "./database.config";
import postRouter from "./routers/post.router";
import path from "path"; // Import 'path' module
import mongoose from "mongoose";
import { UserSchema } from "./models/user.model";
import contactRouter from "./routers/contact.router";
import commentRouter from "./routers/comments.router";
dbConnect();

const app = express();
app.use(express.json());
app.use(
  cors({
    credentials: true,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    origin: ["https://crm-logiscool.onrender.com"],
  })
);

const UserModel = mongoose.model("User", UserSchema);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api", postRouter);
app.use("/api", contactRouter);
app.use("/api/comments", commentRouter);

app.use("/uploads", express.static(path.join(__dirname, "../src/uploads")));
// Serve your Angular static files
app.use(express.static(path.join(__dirname, "../../frontend/dist/weather/")));

// Catch-all route to serve Angular's index.html
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../../frontend/dist/weather/index.html"));
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("website served on http://localhost:" + port);
});
