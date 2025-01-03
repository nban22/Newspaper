import path from "path";
import express, { NextFunction, Request, Response } from "express";
import AppError from "./utils/AppError";
import cookieParser from "cookie-parser";

import userRouter from "./routers/userRouter";
import viewRouter from "./routers/viewRouter";
import articleHandlingRouter from "./routers/articleHandlingRouter";
import adminRouter from "./routers/adminRouter";
import categoriesRouter from "./routers/categoriesRouter";
import tagRouter from "./routers/tagRouter";
import authRouter from "./routers/authRouter";
import subcriberRouter from "./routers/subscriberRouter";
import articleRouter from "./routers/articleRouter";
import facebookRouter from "./routers/facebookRouter";
import googleRouter from "./routers/googleRouter";
import facebookPassport from "./config/facebookPassport";
import cors from "cors";
import commentsRouter from "./routers/commentsRouter";

import googlePassport from "./config/googlePassport";

import expressEjsLayouts from "express-ejs-layouts";
import morgan from "morgan";

const app = express();
const methodOverride = require("method-override");

app.use(methodOverride("_method"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(morgan("dev"));


app.use(cookieParser());


app.use(facebookPassport.initialize());
// app.use(facebookPassport.session());

app.use(googlePassport.initialize());

app.set("view engine", "ejs");
app.set("views", "src/views");
app.use(expressEjsLayouts);
app.set("layout", false);
app.use((req, res, next) => {
    res.locals.scripts = res.locals.scripts || "";
    res.locals.styles = res.locals.styles || "";
    next();
});


app.use(express.static(path.join(__dirname, "../public")));

app.use("/auth/facebook", facebookRouter);
app.use("/auth/google", googleRouter);
app.use("/api/v1", authRouter);
app.use("/", viewRouter);
app.use("/editor/articles", articleHandlingRouter);
app.use("/admin", adminRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/tags", tagRouter);
app.use("/api/v1/articles", articleRouter);
app.use("/api/v1/subscribers", subcriberRouter);
app.use("/api/v1/comments", commentsRouter);

app.all("*", (req, res, next) => {
    return next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    if (err.renderErrorPage) {
        return res.status(err.statusCode).render("pages/error/not_found_page", {
            message: process.env.NODE_ENV === "development" ? err.message : false,
        });
    }

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
});

export default app;
