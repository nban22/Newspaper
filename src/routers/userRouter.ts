import { Router } from "express";

import * as userController from "../controllers/userController";
import { attachUserId, authorizeRole } from "../middlewares/authMiddlewares";
import multer from "multer";

const userRouter = Router();
const upload = multer({ dest: 'public/uploads/' }); 

userRouter.use(attachUserId);

userRouter.get("/", authorizeRole(["admin"]), userController.getAllUsers);

userRouter.post("/", userController.createUser);
userRouter.get("/:id", userController.getUser);
userRouter.delete("/:id", userController.deleteUser);

userRouter.put("/:id", authorizeRole(["admin"]), upload.single("avatar"), userController.updateUserProfile);

export default userRouter;