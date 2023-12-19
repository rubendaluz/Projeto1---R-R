import { Router } from 'express';
import {
    createAccess, getAccessesByUser,
    getAccessesByDate, getAccessesByArea,
    getAccessesByHour, getAllAccesses,
    getAccessesByDateRange, getRecentAccesses
} from '../controllers/acesses.controller.js';

const accessesRoutes = Router();

// http://localhost:4242/api/acesses/register
accessesRoutes.post('/create', createAccess);

// Rota para buscar acessos por usuário
accessesRoutes.get('/user/:userId', getAccessesByUser);

// Rota para buscar acessos por data
accessesRoutes.get('/:date', getAccessesByDate);

// Rota para buscar acessos por hora
accessesRoutes.get('/:hour', getAccessesByHour);

// Rota para buscar acessos por área
accessesRoutes.get('/:startDate/:endDate', getAccessesByDateRange);

// Rota para buscar acessos por área
accessesRoutes.get('/area/:areaId', getAccessesByArea);

// Ultimos 10 acessos
accessesRoutes.get('/recent', getRecentAccesses);

// Rota para buscar todos os acessos
accessesRoutes.get('/', getAllAccesses);


export { accessesRoutes };