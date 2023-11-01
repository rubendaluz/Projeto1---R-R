import { Router } from "express";
import { usersRoutes } from "./user.routes.js";
import { adminRoutes } from "./admin.routes.js";
import { roomRoutes } from "./room.routes.js";


const api = Router();

// Mount user routes
api.use("/user", usersRoutes);
// Mount admin routes
api.use("/admin", adminRoutes);

// Mount room routes
api.use("/room", roomRoutes);


export { api };
