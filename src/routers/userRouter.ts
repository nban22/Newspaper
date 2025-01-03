import { Router } from "express";

import * as userController from "../controllers/userController";
import { attachUserId, authorizeRole } from "../middlewares/authMiddlewares";
import multer from "multer";

const userRouter = Router();
const upload = multer(); 

userRouter.use(upload.none())

userRouter.put("/me",attachUserId, authorizeRole(["writer", "editor", "subscriber"]), userController.updateMyProfile);

userRouter.post("/",attachUserId, authorizeRole(["admin"]), userController.createUser);
userRouter.get("/",attachUserId, authorizeRole(["admin"]), userController.getAllUsers);
userRouter.put("/:id",attachUserId, authorizeRole(["admin"]), userController.updateUser);
userRouter.delete("/:id",attachUserId, authorizeRole(["admin"]), userController.deleteUser);

userRouter.get("/:id", userController.getUser);



export default userRouter;