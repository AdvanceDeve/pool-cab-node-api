const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const fs = require("fs");
const Ride = require("../models/Ride");
require("dotenv").config();

exports.createRide = async (req, res) => {
  try {
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: No user data found." });
    }

    if (req.user.role !== "rider") {
      return res
        .status(403)
        .json({ message: "Access denied. Only riders can create rides." });
    }

    const {
      pickup,
      drop_point,
      departure_date,
      start_time,
      is_free,
      price,
      seat,
      vehicle_type,
      vehicle_number,
      note,
      status,
    } = req.body;

    if (
      !pickup ||
      !drop_point ||
      !start_time ||
      !is_free ||
      !price ||
      !seat ||
      !vehicle_type ||
      !vehicle_number ||
      !status
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRide = await Ride.create({
      user_id: req.user.id,
      pickup,
      drop_point,
      departure_date,
      start_time,
      is_free,
      price,
      seat,
      vehicle_type,
      vehicle_number,
      note,
      status,
      created_by: req.user.id,
      updated_by: req.user.id,
    });

    return res
      .status(201)
      .json({ message: "Ride created successfully", ride: newRide });
  } catch (error) {
    console.error(" Error creating ride:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.listRides = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      pickup = "",
      drop_point = "",
      status = "",
      order = "ASC",
      departure_date = "",
      start_time_from = "",
      start_time_to = "",
    } = req.query;
    const offset = (page - 1) * limit;
    console.log("user", req.user);

    let whereCondition = {
      pickup: { [Op.like]: `%${pickup}%` },
      drop_point: { [Op.like]: `%${drop_point}%` },
      departure_date: { [Op.like]: `%${departure_date}%` },
    };

    if (req.user.role == "rider") {
      whereCondition.user_id = req.user.id;
      if (status != "") {
        whereCondition.status = status;
      }
    } else if (req.user.role == "admin") {
      whereCondition.status = status;
    } else if (req.user.role == "user") {
      if(status != ''){
        whereCondition.status = status;
      }else{
        whereCondition.status = status ? status : { [Op.ne]: "completed" };
      }
    }

    if(start_time_from != '' && start_time_to != ''){
      whereCondition.start_time = { [Op.between]: [start_time_from, start_time_to] };
    }

    if (start_time_from != "") {
      res.status(400).json({ message: "Error fetching start_time", error });
    }
    const rides = await Ride.findAndCountAll({
      where: whereCondition,
      order: [["id", order]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    res.json({ total: rides.count, rides: rides.rows });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.getRideById = async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findByPk(id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }
    return res.status(200).json({ ride });
  } catch (error) {
    console.error("Error fetching ride by ID:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.updateRide = async (req, res) => {
  try {
    
    const { id } = req.params;
    const ride = await Ride.findByPk(id);

    if (req.user.role == "rider" || req.user.role == "admin") {
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }

      await ride.update({ ...req.body, updated_by: req.user.id });

      return res
        .status(200)
        .json({ message: "Ride updated successfully", ride });
    }else{
      return res
        .status(400)
        .json({ message: "Only admin or rider can update"});
    }
  } catch (error) {
    console.error("Error updating ride:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.deleteRide = async (req, res) => {
  try {
    const { id } = req.params;
    const ride = await Ride.findByPk(id);

    if (!ride) {
      return res.status(404).json({ message: "Ride not found" });
    }

    await ride.destroy();
    return res.status(200).json({ message: "Ride deleted successfully" });
  } catch (error) {
    console.error("Error deleting ride:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};
