const express = require("express");
const { register, login, listUsers } = require("../controllers/userController");
const { auth, isAdmin } = require("../middlewares/auth");
const {createRide,listRides,getRideById,updateRide,deleteRide,getRideWithBookings,getRideAndBookingCounts} = require("../controllers/rideController");
const {createBooking,updateBooking,getBookings,getBookingById,deleteBooking,approveBooking} = require("../controllers/bookingController");
const {uploadFile} = require("../controllers/fileController");
const upload = require("../middlewares/upload");
const File = require("../models/File");
const router = express.Router();

//Users
router.post("/register", auth, isAdmin, register);  // Only Admins can register new users with roles
router.post("/login", login);
router.get("/users", auth, listUsers);  // Admin sees all users, regular users see only themselves

//rides
router.post("/createRide",auth,createRide);
router.get("/listRides", auth, listRides);
router.get("/getRideById/:id", auth, getRideById);
router.get("/getRideWithBookings/:id", auth, getRideWithBookings);
router.put("/updateRide/:id", auth, updateRide);
router.delete("/deleteRide/:id", auth, deleteRide);
router.get("/getRideAndBookingCounts/:id", auth, getRideAndBookingCounts);

//Book rides
router.post("/createBooking",auth,createBooking);
router.get("/getBookings",auth,getBookings);
router.put("/updateBooking/:id",auth,updateBooking);
router.get("/getBookingById/:id",auth,getBookingById);
router.delete("/deleteBooking/:id",auth,deleteBooking);
router.post('/approveBooking',auth,approveBooking);


router.post("/upload",auth, upload.single("file"), uploadFile);

module.exports = router;
