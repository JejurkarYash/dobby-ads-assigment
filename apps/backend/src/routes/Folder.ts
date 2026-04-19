import { Router } from "express";
import { createFolder, getFolderSize, getRootFolders, getSubFolders } from "../controllers/Folder.controller.js";

const router: Router = Router();

router.post("/create", createFolder);
router.get("/root", getRootFolders);
router.get("/:id", getSubFolders);
router.get("/:id/size", getFolderSize);

export default router;