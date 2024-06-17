import { Router } from "express";
import AuthController from "../controller/AuthController.js";
import authMiddleware from "../middleware/Authenticate.js";
import ProfileController from "../controller/ProfileController.js";
import NewsController from "../controller/NewsController.js";
import redisCache from "../db/redis.config.js";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// Profile routes
router.get("/profile", authMiddleware, ProfileController.index);
router.put("/profile/:id", authMiddleware, ProfileController.update);

// News routes
router.get("/news", redisCache.route(), NewsController.index);
router.post("/news", authMiddleware, NewsController.store);
router.get("/news/:id", NewsController.show);
router.put("/news/:id", authMiddleware, NewsController.update);
router.delete("/news/:id", authMiddleware, NewsController.destroy);

export default router;
