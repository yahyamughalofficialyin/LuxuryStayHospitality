require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Joi = require("joi");


// Importing Models
const Admin = require("./models/Admin");
const { Staff } = require("./models/Staff");

// Importing Controllers
const adminController = require("./controllers/adminController");
const staffController = require("./controllers/staffController");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// Connect to MongoDB Atlas
connectDB();



// **********************************************************ADMIN CRUD**********************************************************

// **1. CREATE - Add Admin**
app.post("/api/admin/create", adminController.createAdmin);

// **2. READ - Get All Admins**
app.post("/api/admin/create", adminController.readallAdmin);

// **3. READ - Get Admin by ID**
app.post("/api/admin/create", adminController.readAdmin);

// **4. UPDATE - Update Admin by ID**
app.post("/api/admin/create", adminController.updateAdmin);

// **5. DELETE - Delete Admin by ID**
app.post("/api/admin/create", adminController.deleteAdmin);



// **********************************************************STAFF CRUD**********************************************************

// **1. CREATE - Add Staff**
app.post("/api/staff/create", staffController.createStaff);

// **2. READ - Get All Staffs**
app.post("/api/staff/create", staffController.readallStaff);

// **3. READ - Get Staff by ID**
app.post("/api/staff/create", staffController.readStaff);

// **4. UPDATE - Update Staff by ID**
app.post("/api/staff/create", staffController.updateStaff);

// **5. DELETE - Delete Staff by ID**
app.post("/api/staff/create", staffController.deleteStaff);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
