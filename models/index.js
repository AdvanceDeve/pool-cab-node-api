const { Sequelize } = require("sequelize");
const sequelize = require("../config/database");

const Ride = require("./Ride");
const Booking = require("./Booking");
const User = require("./User");

// Define Associations
User.hasMany(Booking, { foreignKey: "user_id", as: "bookings" });
Booking.belongsTo(User, { foreignKey: "user_id", as: "user" });

Ride.hasMany(Booking, { foreignKey: "ride_id", as: "bookings" });
Booking.belongsTo(Ride, { foreignKey: "ride_id", as: "ride" });
 

module.exports = { sequelize, Ride, Booking, User };
