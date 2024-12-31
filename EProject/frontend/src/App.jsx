import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Home from "./Pages/Home";
import Adminread from "./Pages/Adminread";
import Sidebar from "./Components/Sidebar";
import Navbar from "./Components/Navbar";
import Roleread from "./Pages/Roleread";
import Staffread from "./Pages/Staffread";
import Guestread from "./Pages/Guestread";
import Roomtype from "./Pages/Roomtype";
import Roomread from "./Pages/Roomread";
import Floorread from "./Pages/Floorread";
import Foodread from "./Pages/Foodread";
import LaundryRead from "./Pages/Laundryread";
import Feedbackread from "./Pages/Feedbackread";
import Login from "./Pages/Login";
import Bookingroom from "./Pages/Bookingroom";
import Booking from "./Pages/Staff/booking";
import Bookings from "./Pages/Staff/Bookings";
import Logout from "./Pages/Logout";
import Notfound from "./Pages/Notfound";
import StaffLogin from "./Pages/Staff/Login";
import FoodOrder from "./Pages/Staff/FoodOrder";
import Invoice from "./Pages/Staff/Invoice";
import Guest from "./Pages/Staff/Guests";
import CleaningRooms from "./Pages/Staff/Cleaning";
import Analytics from "./Pages/Staff/Analytics";

function App() {
  return (
    <BrowserRouter>
      <AppWithSidebarNavbar />
    </BrowserRouter>
  );
}

function PrivateRoute({ element }) {
  const adminId = sessionStorage.getItem("adminId");
  const staffId = sessionStorage.getItem("staffId");
  const location = useLocation();

  // Redirect admin away from staff panel routes
  if (location.pathname.startsWith("/Staff/") && adminId) {
    return <Navigate to="/" replace />;
  }

  // Staff panel access logic
  if (location.pathname.startsWith("/Staff/")) {
    if (staffId) {
      return element;
    } else {
      return <Navigate to="/Staff/login" replace />;
    }
  }

  // Admin panel access logic
  if (adminId) {
    return element;
  } else {
    return <Navigate to="/login" replace />;
  }
}

function AppWithSidebarNavbar() {
  const location = useLocation();
  const adminId = sessionStorage.getItem("adminId");
  const staffId = sessionStorage.getItem("staffId");

  return (
    <main className="main" id="top">
      <div className="container" data-layout="container">
        {location.pathname !== "/login" && location.pathname !== "/staff/login" && <Sidebar />}
        <div className="content">
          {location.pathname !== "/login" && location.pathname !== "/staff/login" && <Navbar />}
          <Routes>
            <Route path="/" element={<PrivateRoute element={<Home />} />} />
            <Route path="/Admin" element={<PrivateRoute element={<Adminread />} />} />
            <Route path="/Role" element={<PrivateRoute element={<Roleread />} />} />
            <Route path="/Employee" element={<PrivateRoute element={<Staffread />} />} />
            <Route path="/Guest" element={<PrivateRoute element={<Guestread />} />} />
            <Route path="/Roomtype" element={<PrivateRoute element={<Roomtype />} />} />
            <Route path="/Room" element={<PrivateRoute element={<Roomread />} />} />
            <Route path="/Floor" element={<PrivateRoute element={<Floorread />} />} />
            <Route path="/Food" element={<PrivateRoute element={<Foodread />} />} />
            <Route path="/Laundry" element={<PrivateRoute element={<LaundryRead />} />} />
            <Route path="/Feedback" element={<PrivateRoute element={<Feedbackread />} />} />
            <Route path="/bookingroom" element={<PrivateRoute element={<Bookingroom />} />} />
            <Route path="/Staff/" element={<PrivateRoute element={<Booking />} />} />
            <Route path="/Staff/Bookings" element={<PrivateRoute element={<Bookings />} />} />
            <Route path="/Staff/FoodOrder" element={<PrivateRoute element={<FoodOrder />} />} />
            <Route path="/Staff/Guests" element={<PrivateRoute element={<Guest />} />} />
            <Route path="/Staff/Invoice/:id" element={<PrivateRoute element={<Invoice />} />} />
            <Route path="/Staff/Housekeeping/" element={<PrivateRoute element={<CleaningRooms />} />} />
            <Route path="/Staff/Manager/Analytics" element={<PrivateRoute element={<Analytics />} />} />
            <Route path="/logout" element={<PrivateRoute element={<Logout />} />} />

            <Route
              path="/Login"
              element={adminId ? <Navigate to="/" replace /> : <Login />}
            />
            <Route
              path="/staff/login"
              element={staffId ? <Navigate to="/Staff/" replace /> : <StaffLogin />}
            />

            <Route path="*" element={<Notfound />} />
          </Routes>
        </div>
      </div>
    </main>
  );
}

export default App;
