const { DataTypes, Model } = require("sequelize");
const sequelize = require("../config/database"); 
const Booking = require("./Booking");
class Ride extends Model {}

Ride.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: { type: DataTypes.INTEGER, allowNull: false },
    pickup: { type: DataTypes.STRING, allowNull: false },
    drop_point: { type: DataTypes.STRING, allowNull: false },
    departure_date: { type: DataTypes.DATEONLY, allowNull: false },
    start_time: { type: DataTypes.TIME, allowNull: false },
    is_free: { type: DataTypes.ENUM("free", "paid"), allowNull: false },
    price: { type: DataTypes.FLOAT, allowNull: true, defaultValue:0.00 },
    seat: { type: DataTypes.INTEGER, allowNull: false },
    vehicle_type: { type: DataTypes.ENUM("car", "scooty", "bike"), allowNull: false },
    vehicle_number: { type: DataTypes.STRING, allowNull: false },
    note: { type: DataTypes.TEXT, allowNull: true },
    status: {
      type: DataTypes.ENUM("yet_to_start", "ongoing", "completed", "canceled", "deleted"),
      allowNull: false,
    },
    created_by: { type: DataTypes.INTEGER, allowNull: false },
    updated_by: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    sequelize,
    modelName: "Ride",
    tableName: "rides",
    timestamps: true,
    underscored: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
 
Ride.hasMany(Booking, { foreignKey: 'ride_id' });

module.exports = Ride;
