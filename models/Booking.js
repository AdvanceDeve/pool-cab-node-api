const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); // Import Sequelize instance
// const Ride = require("./Ride"); // Import Ride model
// const User = require("./User"); // Import User model

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    ride_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: Ride,
      //   key: "id",
      // },
      // onDelete: "CASCADE",
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      // references: {
      //   model: User,
      //   key: "id",
      // },
      // onDelete: "CASCADE",
    },
    status: {
      type: DataTypes.ENUM("booked", "canceled"),
      allowNull: false,
    },
    is_approved: {
      type: DataTypes.ENUM("approved", "reject", "pending"),
      allowNull: false,
      defaultValue: "pending",
    },
    created_by: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_by: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "booking",
    timestamps: true, // Enables createdAt & updatedAt
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
 
// Booking.belongsTo(Ride, { foreignKey: 'ride_id', as: 'Ride', onDelete: 'CASCADE' });
// Booking.belongsTo(User, { foreignKey: 'user_id', as: 'User', onDelete: 'CASCADE' }); 

// Booking.belongsTo(User, { foreignKey: 'user_id' });
// Booking.belongsTo(Ride, { foreignKey: 'ride_id' });


module.exports = Booking;
