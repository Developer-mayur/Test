import express  from "express";
import {Signup,Signin,forgetpass,Resetpass} from "../controller/userController.js"

const router =express.Router();
router.post("/signup",Signup);
router.post("/login",Signin);
router.post("/forget-password",forgetpass);
router.get("/reset-passward",Resetpass)


export default router;