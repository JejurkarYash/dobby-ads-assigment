import { Router } from "express";
import { upload } from "@repo/cloudinary";
import { getImages, uploadImage } from "../controllers/Image.controller.js";
const router: Router = Router();

router.post("/upload", upload.single("image"), uploadImage);
router.get("/:folderId", getImages);

export default router;