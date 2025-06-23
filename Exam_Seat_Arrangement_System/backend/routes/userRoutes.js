import express from "express";
import { loginController, logoutController } from "../controllers/userController.js";
import { authenticate } from "../middlewares/authenticate.js";

const router = express.Router();

router.post("/login", loginController);

//  protected route:
router.get("/profile", authenticate, (req, res) => {
    try {
      res.json({
        success: true,
        message: "Welcome Admin",
        user: req.user,
      });
    } catch (err) {
      console.error("Profile route error:", err);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });

  router.get("/logout", logoutController);

  

export default router;
