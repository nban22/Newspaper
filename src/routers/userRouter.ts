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
userRouter.put("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);

userRouter.get("/:id", userController.getUser);

userRouter.post("/assign-category", userController.assignCategory);



export default userRouter;