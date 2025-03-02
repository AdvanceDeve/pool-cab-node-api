const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Ride = sequelize.define("Ride", {
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  pickup: { type: DataTypes.STRING, allowNull: false },
  drop_point: { type: DataTypes.STRING, allowNull: false },
  departure_date: { type: DataTypes.STRING, allowNull: false },
  start_time: { type: DataTypes.STRING, allowNull: false },
  is_free: { type: DataTypes.ENUM("free", "paid"), allowNull: false },
  price: { type: DataTypes.FLOAT, allowNull: false },
  seat: { type: DataTypes.INTEGER, allowNull: false },
  vehicle_type: { type: DataTypes.ENUM("car", "scooty", "bike"), allowNull: false },
  vehicle_number: { type: DataTypes.STRING, allowNull: false },
  note: { type: DataTypes.TEXT, allowNull: true },
  status: { type: DataTypes.ENUM("yet_to_start", "ongoing", "completed", "canceled", "deleted"), allowNull: false },
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  updated_by: { type: DataTypes.INTEGER, allowNull: false },
}, {
  timestamps: true,
  underscored: true,
//   createdAt: "created_at",
//   updatedAt: "updated_at",
});

module.exports = Ride;
