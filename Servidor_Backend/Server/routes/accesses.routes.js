import { Router } from 'express';
import {
    createAccess, getAccessesByUser,
    getAccessesByDate, getAccessesByArea,
    getAccessesByHour
} from '../controllers/acesses.controller.js';

const accessesRoutes = Router();

// http://localhost:4242/api/acesses/register
accessesRoutes.post('/create', createAccess);

// Rota para buscar acessos por usuário
router.get('/acesses/:userId', getAccessesByUser);

// Rota para buscar acessos por data
router.get('/acesses/:date', getAccessesByDate);

// Rota para buscar acessos por hora
router.get('/acesses/:hour', getAccessesByHour);

// Rota para buscar acessos por área
router.get('/acesses/:areaId', getAccessesByArea);


export { accessesRoutes };