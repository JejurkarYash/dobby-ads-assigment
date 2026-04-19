import { Router } from "express";
import { signin, signup } from "../controllers/Auth.controller.js";

const router: Router = Router();


router.post("/signup", signup);
router.post("/signin", signin);


export default router;