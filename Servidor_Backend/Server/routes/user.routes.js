import Router from "express";
import multer from "multer";
import path from "path";
import {
  register,
  getUserProfile,
  getAllUsers,
  updateUser,
  deleteUser,
  authenticateUser,
  updateUserFingerprint,
  updateAllUsersFingerprints,
  changePassword,
  authenticateUserNFC,
  login,
} from "../controllers/user.controller.js";

const usersRoutes = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../../Interface_web/img/User');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });


// http://localhost:4242/api/user/:id
usersRoutes.put("/update/:id", upload.none(), updateUser);

// http://localhost:4242/api/user/register
usersRoutes.post('/register', upload.single('photo'), register);

// http://localhost:4242/api/user/:id
usersRoutes.get("/:id", getUserProfile);

// http://localhost:4242/api/user/
usersRoutes.get("/", getAllUsers);




// http://localhost:4242/api/user/:id
usersRoutes.delete("/:id", deleteUser);

// http://localhost:4242/api/user/authenticate
usersRoutes.post("/authenticate", authenticateUser);

// http://localhost:4242/api/user/authenticate
usersRoutes.post("/userlogin", login);

// http://localhost:4242/api/user/updateFingerprint
usersRoutes.put("/updateFingerprint", updateUserFingerprint);

// http://localhost:4242/api/user/updateAllFingerprints
usersRoutes.put("/updateAllFingerprints", updateAllUsersFingerprints);

// http://localhost:4242/api/user/updateAllFingerprints
usersRoutes.post('/change-password', changePassword);

// http://localhost:4242/api/user/authenticatenfc
usersRoutes.post("/authenticateNfc", authenticateUserNFC);

export { usersRoutes };
