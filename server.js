const express = require("express");
const sequelize = require("./config/database");
const routes = require("./routes/routes");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", routes);

// Start Server
const PORT = process.env.PORT || 5000;
sequelize.sync().then(() => {
    console.log("Database connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log("Database error:", err));
