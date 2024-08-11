import { Router } from "express";
import { isAdmin, isAuthenticated } from "../../utils/middlewares";
import { getBotGuildController, getGuildController, getGuildPermissionsController, getGuildsController } from "../../controllers/guilds";
const router = Router();

router.get("/", isAuthenticated, getGuildsController);
router.get("/:id/permissions", isAuthenticated, getGuildPermissionsController);
router.get("/:id", isAdmin, getGuildController);


export default router;
