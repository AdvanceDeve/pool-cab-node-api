const { Op } = require("sequelize");
const Ride = require("../models/Ride");
const Booking = require("../models/Booking");
const dayjs = require("dayjs");
require("dotenv").config();
const sequelize = require("../config/database"); 


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
      seat,
      vehicle_type,
      vehicle_number,
      note,
      status,
    } = req.body;
    let { price } = req.body;
    if (
      !pickup ||
      !drop_point ||
      !start_time ||
      !is_free ||
      !seat ||
      !vehicle_type ||
      !vehicle_number
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }
    let _status = 'yet_to_start';
    let _price = 0.0;
    if(price == null || price == ''){
      price = _price;
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
      status:_status,
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
    // console.log("user", req.user);

    let whereCondition = {
      pickup: { [Op.like]: `%${pickup}%` },
      drop_point: { [Op.like]: `%${drop_point}%` },
      
    };

    const formattedDate = dayjs().format('YYYY-MM-DD');
    if(req.user.role != "rider"){
      if(departure_date == ''){      
        whereCondition.departure_date  = formattedDate;
      }else{
        whereCondition.departure_date  = { [Op.like]: `%${departure_date}%`};
      }
    }
    
    if (req.user.role == "rider") {
      whereCondition.user_id = req.user.id;
      if (status != "") {
        whereCondition.status = status;
      }else{
        whereCondition.status = status ? status : { [Op.ne]: "deleted" };
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
    // console.log('whereCondition::',whereCondition)
    if(start_time_from != '' && start_time_to != ''){
      whereCondition.start_time = { [Op.between]: [start_time_from, start_time_to] };
    }
    // else{
    //   if (req.user.role != "rider") {
    //     var _start_time_from = dayjs().format('H:mm');
    //     console.log('formattedTime::',_start_time_from)
    //     whereCondition.start_time = { [Op.between]: [_start_time_from, '23:59:59'] };
    //   }
    // }

    if (start_time_from != "") {
      res.status(400).json({ message: "Error fetching start_time", error });
    }
     
    const rides = await Ride.findAndCountAll({
      where: whereCondition,
      order: [["start_time", order]],
      limit: parseInt(limit),
      offset: parseInt(offset),
      // logging: console.log,  // Logs all executed queries
    });

    res.json({ total: rides.count, rides: rides.rows });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

exports.getRideById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.role == "rider" || req.user.role == "admin") {
      const ride = await Ride.findByPk(id);

      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }
      return res.status(200).json({ ride });
    }else{
      return res
        .status(400)
        .json({ message: "Only admin or rider can update"});
    }
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
    let ride = ''; 

    if (req.user.role == "rider" || req.user.role == "admin") {
      ride = await Ride.findByPk(id);
      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }else{
        if(ride.user_id == req.user.id || req.user.role == "admin"){
          await ride.update({ ...req.body, updated_by: req.user.id });
        }else{
          return res.status(400).json({ message: "You are not an authorized person." });
        }
      }     

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
    if (req.user.role == "rider" || req.user.role == "admin") {
      const ride = await Ride.findByPk(id);

      if (!ride) {
        return res.status(404).json({ message: "Ride not found" });
      }
      if (ride.user_id == req.user.id || req.user.role == "admin") {
        await ride.destroy();
        return res.status(200).json({ message: "Ride deleted successfully" });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Only admin or rider can delete" });
    }
  } catch (error) {
    console.error("Error deleting ride:", error);
    return res
      .status(500)
      .json({ message: "Server error", error: error.message });
  }
};

exports.getRideWithBookings = async (req, res) => {
  try {
    const { id: rideId } = req.params;

    const [results] = await sequelize.query(
      `SELECT 
        r.id,r.user_id AS rider_id,r.pickup,r.drop_point,r.departure_date,r.start_time, 
        b.id AS booking_id, b.status AS booking_status, b.is_approved,
        u.id AS user_id, u.name, u.email, u.phone
      FROM rides r
      LEFT JOIN booking b ON b.ride_id = r.id
      LEFT JOIN users u ON u.id = b.user_id
      WHERE r.id = :rideId`,
      {
        replacements: { rideId },
      }
    );

    if (!results || results.length === 0) {
      return res.status(404).json({ message: "Ride not found" });
    }

    res.json(results);
  } catch (error) {
    console.error("Error fetching ride details:", error);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getRideAndBookingCounts = async (req, res) => {
  try {
    const userId = req.params.id;

    // Step 1: Get ride count and IDs for the specific user, excluding 'deleted' status
    const rides = await Ride.findAll({
      attributes: [
        [sequelize.fn('COUNT', sequelize.col('id')), 'ride_count'],
        [sequelize.fn('GROUP_CONCAT', sequelize.col('id')), 'ids']
      ],
      where: {
        created_by: userId,
        status: { [Op.not]: 'deleted' }
      },
      raw: true
    });

    const rideIds = rides[0].ids ? rides[0].ids.split(',').map(id => parseInt(id)) : [];
    const rideCount = rides[0].ride_count.toString();

    // Step 2: Get total bookings where ride_id IN (user's rides)
    const bookingCount = await Booking.count({
      where: {
        ride_id: {
          [Op.in]: rideIds
        }
      }
    });

    return res.status(200).json({
      rides: rideCount,
      bookings: bookingCount.toString()
    });

  } catch (error) {
    console.error('Error fetching ride/booking counts:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};


function convertTo24HourFormat(time12h) {
  let [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');

  if (modifier.toLowerCase() === 'pm' && hours !== '12') {
      hours = String(Number(hours) + 12);
  } else if (modifier.toLowerCase() === 'am' && hours === '12') {
      hours = '00';
  }

  return `${hours}:${minutes}`;
}
 

