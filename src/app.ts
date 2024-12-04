import path from "path";
import express, { NextFunction, Request, Response } from "express";
import userRouter from "./routers/userRouter";
import viewRouter from "./routers/viewRouter";
import categoriesRouter from "./routers/categoriesRouter";
import authRouter from "./routers/authRouter";
import articleRouter from "./routers/articleRouter";


import AppError from "./utils/AppError";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", "src/views");

app.use(express.static(path.join(__dirname, "../public")));


app.use("/api/v1/users", userRouter);
app.use("/api/v1/auth", authRouter);
app.use("/", viewRouter);
app.use("/api/v1/categories", categoriesRouter); 
app.use("/api/v1/articles", articleRouter);

app.all("*", (req, res, next) => {
    return next(new AppError(404, `Can't find ${req.originalUrl} on this server!`));
})


app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || "error";

    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
})


export default app;