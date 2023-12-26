import { Router } from "express";
import { usersRoutes } from "./user.routes.js";
import { adminRoutes } from "./admin.routes.js";
import { roomRoutes } from "./room.routes.js";
import { accessesRoutes } from "./accesses.routes.js";
import { countEntities } from "../controllers/Statistics.controller.js";

const api = Router();

// Mount user routes
api.use("/user", usersRoutes);
// Mount admin routes
api.use("/admin", adminRoutes);
// Mount room routes
api.use("/room", roomRoutes);
// Mount accesses routes
api.use("/acesses", accessesRoutes);

// Mount Statistics route http://localhost:4242/api/statistics/

api.get("/statistics", countEntities);

export { api };
