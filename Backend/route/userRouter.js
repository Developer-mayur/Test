import express  from "express";
import {Signup,Signin,forgetpass,Resetpass,updatepass} from "../controller/userController.js"

const router =express.Router();
router.post("/signup",Signup);
router.post("/login",Signin);
router.post("/forget-password",forgetpass);
router.get("/reset-passward",Resetpass)
router.post("/reset-passward",updatepass)


export default router;