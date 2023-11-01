import Router from "express";
import {
 
  register,
  getUserProfile,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

//--ROUTES--//
const usersRoutes = Router();


// http://localhost:4242/api/user/register
usersRoutes.post("/register", register);

// http://localhost:4242/api/user/:id
usersRoutes.get("/:id", getUserProfile);

// http://localhost:4242/api/user/
usersRoutes.get("/", getAllUsers);

// http://localhost:4242/api/user/:id
usersRoutes.put("/:id", updateUser);

// http://localhost:4242/api/user/:id
usersRoutes.delete("/:id", deleteUser);

export { usersRoutes };
