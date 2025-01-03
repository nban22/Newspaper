import { Router } from "express";
import * as articleController from "../controllers/articleController";
import { attachUserId, authorizeRole } from "../middlewares/authMiddlewares";
import multer from "multer";

const upload = multer({ 
    dest: 'public/uploads/article_images', 
    limits: { fileSize: 10 * 1024 * 1024 } // 10MB
}); 

const articleRouter = Router();


articleRouter.post("/", attachUserId, authorizeRole(["writer"]), upload.single("image"), articleController.createArticle); // Route to create a new article
articleRouter.put("/:articleId", attachUserId, authorizeRole(["writer"]), articleController.updateArticle); // Route to update an article
articleRouter.post("/upload", attachUserId, authorizeRole(["writer"]), upload.single("image"), articleController.uploadImage); // Route to upload an image

export default articleRouter;