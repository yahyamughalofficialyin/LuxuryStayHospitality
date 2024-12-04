require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Joi = require("joi");


// Importing Models
const { Admin } = require("./models/Admin");
const { Staff } = require("./models/Staff");
const { Guest } = require("./models/Guest");
const { Role } = require("./models/Role");
const { Roomtype } = require("./models/Roomtype");
const { Laundry } = require("./models/Laundry");
const { Floor } = require("./models/Floor");
const { Room } = require("./models/Room");
const { Food } = require("./models/Food");
const { Booking } = require("./models/Booking");

// Importing Controllers
const adminController = require("./controllers/adminController");
const staffController = require("./controllers/staffController");
const guestController = require("./controllers/guestController");
const roleController = require("./controllers/roleController");
const laundryController = require("./controllers/laundryController");
const roomtypeController = require("./controllers/roomtypeController");
const floorController = require("./controllers/floorController");
const roomController = require("./controllers/roomController");
const foodController = require("./controllers/foodController");
const bookingController = require("./controllers/bookingController");

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



// **********************************************************GUEST CRUD**********************************************************

// **1. CREATE - Add Guest**
app.post("/api/guest/create", guestController.createGuest);

// **2. READ - Get All Guests**
app.get("/api/guest/", guestController.readallGuest);

// **3. READ - Get Guest by ID**
app.get("/api/guest/:id", guestController.readGuest);

// **4. UPDATE - Update Guest by ID**
app.put("/api/guest/update/:id", guestController.updateGuest);

// **5. DELETE - Delete Guest by ID**
app.delete("/api/guest/delete/:id", guestController.deleteGuest);



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



// **********************************************************LAUNDRY CRUD**********************************************************

// **1. CREATE - Add laundry**
app.post("/api/laundry/create", laundryController.createLaundry);

// **2. READ - Get All Laundrys**
app.get("/api/laundry/", laundryController.readallLaundry);

// **3. READ - Get Laundry by ID**
app.get("/api/laundry/:id", laundryController.readLaundry);

// **4. UPDATE - Update Laundry by ID**
app.put("/api/laundry/update/:id", laundryController.updateLaundry);

// **5. DELETE - Delete Laundry by ID**
app.delete("/api/laundry/delete/:id", laundryController.deleteLaundry);



// **********************************************************ROOM TYPE CRUD**********************************************************

// **1. CREATE - Add Roomtype**
app.post("/api/roomtype/create", roomtypeController.createRoomtype);

// **2. READ - Get All Roomtypes**
app.get("/api/roomtype/", roomtypeController.readallRoomtype);

// **3. READ - Get Roomtype by ID**
app.get("/api/roomtype/:id", roomtypeController.readRoomtype);

// **4. UPDATE - Update Roomtype by ID**
app.put("/api/roomtype/update/:id", roomtypeController.updateRoomtype);

// **5. DELETE - Delete Roomtype by ID**
app.delete("/api/roomtype/delete/:id", roomtypeController.deleteRoomtype);



// **********************************************************FLOOR CRUD**********************************************************

// **1. CREATE - Add Floor**
app.post("/api/floor/create", floorController.createFloor);

// **2. READ - Get All Floors**
app.get("/api/floor/", floorController.readallFloor);

// **3. READ - Get Floor by ID**
app.get("/api/floor/:id", floorController.readFloor);

// **4. UPDATE - Update Floor by ID**
app.put("/api/floor/update/:id", floorController.updateFloor);

// **5. DELETE - Delete Floor by ID**
app.delete("/api/floor/delete/:id", floorController.deleteFloor);



// **********************************************************ROOM CRUD**********************************************************

// **1. CREATE - Add Room**
app.post("/api/room/create", roomController.createRoom);

// **2. READ - Get All Rooms**
app.get("/api/room/", roomController.readallRoom);

// **3. READ - Get Room by ID**
app.get("/api/room/:id", roomController.readRoom);

// **4. UPDATE - Update Room by ID**
app.put("/api/room/update/:id", roomController.updateRoom);

// **5. DELETE - Delete Room by ID**
app.delete("/api/room/delete/:id", roomController.deleteRoom);



// **********************************************************FOOD CRUD**********************************************************

// **1. CREATE - Add Food**
app.post("/api/food/create", foodController.createFood);

// **2. READ - Get All Foods**
app.get("/api/food/", foodController.readallFood);

// **3. READ - Get Food by ID**
app.get("/api/food/:id", foodController.readFood);

// **4. UPDATE - Update Food by ID**
app.put("/api/food/update/:id", foodController.updateFood);

// **5. DELETE - Delete Food by ID**
app.delete("/api/food/delete/:id", foodController.deleteFood);



// **********************************************************BOOKING CRUD**********************************************************

// **1. CREATE - Add Booking**
app.post("/api/booking/create", bookingController.createBooking);

// **2. READ - Get All Bookings**
app.get("/api/booking/", bookingController.readallBooking);

// **3. READ - Get Booking by ID**
app.get("/api/booking/:id", bookingController.readBooking);

// **4. UPDATE - Update Booking by ID**
app.put("/api/booking/update/:id", bookingController.updateBooking);

// **5. DELETE - Delete Booking by ID**
app.delete("/api/booking/delete/:id", bookingController.deleteBooking);

// Updating Room Status on Booking
app.patch("/api/room/:id", async (req, res) => {
    try {
        const roomId = req.params.id;
        const updates = req.body;

        const updatedRoom = await Room.findByIdAndUpdate(roomId, updates, { new: true });

        if (!updatedRoom) {
            return res.status(404).json({ message: "Room not found" });
        }

        res.status(200).json({ message: "Room updated successfully", room: updatedRoom });
    } catch (error) {
        console.error("Error updating room:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});



// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
