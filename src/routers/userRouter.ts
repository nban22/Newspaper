import { Router } from "express";

import * as userController from "../controllers/userController";

const userRouter = Router();

userRouter.get("/", userController.getAllUsers);
userRouter.post("/", userController.createUser);
userRouter.get("/:id", userController.getUser);
userRouter.patch("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

export default userRouter;