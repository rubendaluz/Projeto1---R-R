import { Router } from "express";
import { countEntities } from "../controllers/Statistics.controller.js";

const accessesRoutes = Router();

// Rota para contar acessos, administradores, usuários e salas
// http://localhost:4242/api/statistics/
accessesRoutes.get("/", countEntities);

export { accessesRoutes };
