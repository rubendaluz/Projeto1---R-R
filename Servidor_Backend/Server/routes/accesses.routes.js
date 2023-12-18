import { Router } from 'express';
import {
    createAccess, getAccessesByUser,
    getAccessesByDate, getAccessesByArea,
    getAccessesByHour, getAllAccesses
} from '../controllers/acesses.controller.js';

const accessesRoutes = Router();

// http://localhost:4242/api/acesses/register
accessesRoutes.post('/create', createAccess);

// Rota para buscar acessos por usuário
router.get('/:userId', getAccessesByUser);

// Rota para buscar acessos por data
router.get('/:date', getAccessesByDate);

// Rota para buscar acessos por hora
router.get('/:hour', getAccessesByHour);

// Rota para buscar acessos por área
router.get('/:areaId', getAccessesByArea);

// Rota para buscar todos os acessos
accessesRoutes.get('/', getAllAccesses);


export { accessesRoutes };