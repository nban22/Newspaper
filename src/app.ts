import path from "path";
import express, { NextFunction, Request, Response } from "express";
import AppError from "./utils/AppError";
import cookieParser from "cookie-parser";

import userRouter from "./routers/userRouter";
import viewRouter from "./routers/viewRouter";
import adminRouter from "./routers/adminRouter";
import categoriesRouter from "./routers/categoriesRouter";
import authRouter from "./routers/authRouter";
import articleRouter from "./routers/articleRouter";
import facebookRouter from "./routers/facebookRouter";
import googleRouter from "./routers/googleRouter";
import facebookPassport from "./config/facebookPassport";
import googlePassport from "./config/googlePassport";

const app = express();
const methodOverride = require("method-override");

app.use(methodOverride('_method'))
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// app.use(session({
//     secret: process.env.SESSION_SECRET!,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//         maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
//     },
// }))
app.use(facebookPassport.initialize());
// app.use(facebookPassport.session());

app.use(googlePassport.initialize());

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth/facebook", facebookRouter);
app.use("/auth/google", googleRouter);
app.use("/api/v1", authRouter);
app.use("/", viewRouter);
app.use("/admin", adminRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/articles", articleRouter);

app.all("*", (req, res, next) => {
    return next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
});

export default app;
