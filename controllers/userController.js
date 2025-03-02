const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");
const User = require("../models/User");
require("dotenv").config(); 

exports.register = async (req, res) => {
    try {
        const { name, email, password, role, phone } = req.body;

        if (!/^[0-9]{10}$/.test(phone)) {
            return res.status(400).json({ message: "Invalid phone number. Must be 10 digits." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = Math.floor(100000 + Math.random() * 900000);
         

        const user = await User.create({ 
            name,
            email,
            phone,
            otp,
            password: hashedPassword,  // Use the hashed password
            role: role || "user"
        });
         
        const userResponse = {
            id: user.id,            
            email: user.email,
            phone: user.phone,
            role: user.role,
            status: user.status,
            otp: user.otp  
        };
        res.status(201).json({ message: "User registered successfully", user:userResponse });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Registration failed", error });
    }
};

exports.login = async (req, res) => {
    try {
        let { email, password } = req.body; 
        // Find user in the database
        const user = await User.findOne({ where: { email } });
        if (!user) {
            console.log("User not found!");
            return res.status(400).json({ message: "Invalid credentials" });
        } 
        // Compare password correctly
        const isMatch = await bcrypt.compare(password, user.password);
      
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        // Generate JWT Token
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Login successful", token, role: user.role });

    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: "Login failed", error });
    }
};


exports.listUsers = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "", status = "Active", order = "ASC" } = req.query;
        const offset = (page - 1) * limit;

        let whereCondition = {
            status: status,
            [Op.or]: [
                { name: { [Op.like]: `%${search}%` } },
                { email: { [Op.like]: `%${search}%` } }
            ]
        };

        // Regular users can only see their own profile
        if (req.user.role !== "admin") {
            whereCondition = { id: req.user.id };
        }

        const users = await User.findAndCountAll({
            where: whereCondition,
            order: [["id", order]],
            limit: parseInt(limit),
            offset: parseInt(offset),
        });

        res.json({ total: users.count, users: users.rows });
    } catch (error) {
        res.status(500).json({ message: "Error fetching users", error });
    }
};


