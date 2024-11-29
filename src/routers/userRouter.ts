import { Router } from "express";

import * as userController from "../controllers/userController";
import multer from "multer";

const userRouter = Router();
const upload = multer({ dest: 'public/uploads/' }); 

userRouter.get("/", userController.getAllUsers);
userRouter.post("/", userController.createUser);
userRouter.get("/:id", userController.getUser);
userRouter.patch("/:id", userController.updateUser);
userRouter.delete("/:id", userController.deleteUser);


userRouter.put("/:id", upload.single("avatar"), userController.updateUserProfile);

export default userRouter;