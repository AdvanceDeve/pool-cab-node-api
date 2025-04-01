const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const File = sequelize.define("documets", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  filename: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  filePath: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  fileType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  comment:{type: DataTypes.STRING, allowNull: true},
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  doc_type: { type: DataTypes.ENUM("license", "rcbook", "profile", "attachment"), allowNull: false },
  is_delete: {type: DataTypes.INTEGER, allowNull: false},
  created_by: { type: DataTypes.INTEGER, allowNull: false },
  updated_by: { type: DataTypes.INTEGER, allowNull: true },
});

module.exports = File;
