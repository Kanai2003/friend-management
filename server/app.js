import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: "https://friend-management.vercel.app",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
}));

//middleware config
app.use(express.json({limit: "16kb"}));  //config for json data
app.use(express.urlencoded({extended: true, limit: "16kb"}));  //config for encoded url
app.use(express.static("public")); //config for static assets
app.use(cookieParser())

// import routes
import authRouter from "./routes/auth.route.js";
import friendRouter from "./routes/friend.route.js";

//routes declaration
app.use("/api/v1/user", authRouter );
app.use("/api/v1/friend", friendRouter);

export { app };
