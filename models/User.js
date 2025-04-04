const { DataTypes } = require("sequelize");
const sequelize = require("../config/database"); 
const Booking = require("./Booking");

const User = sequelize.define("users", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    phone: { 
        type: DataTypes.STRING, 
        allowNull: false, 
        unique: true,
        validate: {
            is: /^[0-9]{10}$/  
        }
    },
    role: { 
        type: DataTypes.ENUM("admin", "user", "rider"), 
        defaultValue: "user" 
    },
    otp: { type: DataTypes.STRING, allowNull: false },
    status: { type: DataTypes.ENUM("active", "inactive"), defaultValue: "active" }
}, {
    timestamps: true,
    underscored: true 
}); 
User.hasMany(Booking, { foreignKey: 'user_id' });
module.exports = User;
