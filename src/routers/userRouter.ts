import { Router } from "express";

import * as userController from "../controllers/userController";
import { attachUserId, authorizeRole } from "../middlewares/authMiddlewares";
import multer from "multer";

const userRouter = Router();
const upload = multer(); 

userRouter.use(upload.none())
userRouter.use(attachUserId);

userRouter.put("/me", authorizeRole(["writer", "editor", "subscriber"]), userController.updateMyProfile);

userRouter.post("/", authorizeRole(["admin"]), userController.createUser);
userRouter.get("/", authorizeRole(["admin"]), userController.getAllUsers);
userRouter.put("/:id", authorizeRole(["admin"]), userController.updateUser);
userRouter.delete("/:id", authorizeRole(["admin"]), userController.deleteUser);

userRouter.get("/:id", userController.getUser);



export default userRouter;