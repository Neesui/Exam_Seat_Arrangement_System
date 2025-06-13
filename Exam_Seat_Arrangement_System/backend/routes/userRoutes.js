import express from "express";

const router = express.Router()

router.route("/login",loginController)

export default router