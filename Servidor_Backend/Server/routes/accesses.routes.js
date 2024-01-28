import { Router } from 'express';
import {
    createAccess, getAccessesByUser,
    getAllAccesses,
    getRecentAccesses,
    
} from '../controllers/acesses.controller.js';

const accessesRoutes = Router();

// http://localhost:4242/api/acesses/create
accessesRoutes.post('/create', createAccess);

// Rota para buscar acessos por usuário
accessesRoutes.get('/user/:userId', getAccessesByUser);

// Ultimos 10 acessos
accessesRoutes.get('/recent', getRecentAccesses);

// Rota para buscar todos os acessos
accessesRoutes.get('/', getAllAccesses);





export { accessesRoutes };