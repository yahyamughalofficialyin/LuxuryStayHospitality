require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Joi = require("joi");


// Importing Models
const Admin = require("./models/Admin");
const { Staff } = require("./models/Staff");
const { Role } = require("./models/Role");

// Importing Controllers
const adminController = require("./controllers/adminController");
const staffController = require("./controllers/staffController");
const roleController = require("./controllers/roleController");

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
app.get("/api/admin/", adminController.readallAdmin);

// **3. READ - Get Admin by ID**
app.get("/api/admin/:id", adminController.readAdmin);

// **4. UPDATE - Update Admin by ID**
app.put("/api/admin/update/:id", adminController.updateAdmin);

// **5. DELETE - Delete Admin by ID**
app.delete("/api/admin/delete/:id", adminController.deleteAdmin);



// **********************************************************STAFF CRUD**********************************************************

// **1. CREATE - Add Staff**
app.post("/api/staff/create", staffController.createStaff);

// **2. READ - Get All Staffs**
app.get("/api/staff/", staffController.readallStaff);

// **3. READ - Get Staff by ID**
app.get("/api/staff/:id", staffController.readStaff);

// **4. UPDATE - Update Staff by ID**
app.put("/api/staff/update/:id", staffController.updateStaff);

// **5. DELETE - Delete Staff by ID**
app.delete("/api/staff/delete/:id", staffController.deleteStaff);



// **********************************************************ROLE CRUD**********************************************************

// **1. CREATE - Add Role**
app.post("/api/role/create", roleController.createRole);

// **2. READ - Get All Roles**
app.get("/api/role/", roleController.readallRole);

// **3. READ - Get Role by ID**
app.get("/api/role/:id", roleController.readRole);

// **4. UPDATE - Update Role by ID**
app.put("/api/role/update/:id", roleController.updateRole);

// **5. DELETE - Delete Role by ID**
app.delete("/api/role/delete/:id", roleController.deleteRole);

// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
