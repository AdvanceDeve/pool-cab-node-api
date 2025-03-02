const express = require("express");
const { register, login, listUsers } = require("../controllers/userController");
const { auth, isAdmin } = require("../middlewares/auth");
const {createRide,listRides,getRideById,updateRide,deleteRide} = require("../controllers/rideController");
const router = express.Router();

//Users
router.post("/register", auth, isAdmin, register);  // Only Admins can register new users with roles
router.post("/login", login);
router.get("/users", auth, listUsers);  // Admin sees all users, regular users see only themselves

//rides
router.post("/createRide",auth,createRide);
router.get("/listRides", auth, listRides);
router.get("/getRideById/:id", auth, getRideById);
router.put("/updateRide/:id", auth, updateRide);
router.delete("/deleteRide/:id", auth, deleteRide);

module.exports = router;
