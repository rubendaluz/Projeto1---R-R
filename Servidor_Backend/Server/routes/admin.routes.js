import { Router } from 'express';
import {
    loginAdmin,
  registerAdmin,
  updateAdmin,
  getAdminProfile,
  deleteAdmin,
  getAllAdmins,
}  from '../controllers/admin.controller.js';

const adminRoutes = Router();

// http://localhost:4242/api/admin/register
adminRoutes.post('/register', registerAdmin);

// http://localhost:4242/api/admin/login
adminRoutes.post('/login', loginAdmin);

// http://localhost:4242/api/admin/:id
adminRoutes.get('/:id', getAdminProfile);
adminRoutes.put('/:id', updateAdmin);
adminRoutes.delete('/:id', deleteAdmin);

// http://localhost:4242/api/admin/
adminRoutes.get("/", getAllAdmins);

export { adminRoutes };
