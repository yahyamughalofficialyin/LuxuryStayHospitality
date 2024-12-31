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

function PrivateRoute({ element, allowedRoles }) {
  const adminId = sessionStorage.getItem("adminId");
  const staffId = sessionStorage.getItem("staffId");
  const [role, setRole] = useState(null);
  const location = useLocation();

  useEffect(() => {
    if (staffId) {
      // Fetch staff role
      fetch(`http://localhost:5000/api/staff/${staffId}`)
        .then((response) => response.json())
        .then((staffData) =>
          fetch(`http://localhost:5000/api/role/${staffData.role}`)
            .then((response) => response.json())
            .then((roleData) => setRole(roleData.name))
        )
        .catch((error) => console.error("Error fetching role data:", error));
    }
  }, [staffId]);

  // Staff panel access logic
  if (location.pathname.startsWith("/Staff/")) {
    if (staffId) {
      if (allowedRoles.includes(role)) {
        return element; // Allow access if role is permitted
      } else {
        return <Navigate to="*" replace />; // Redirect to Notfound page if role is not allowed
      }
    } else {
      return <Navigate to="/Staff/login" replace />; // Redirect to login if staff is not logged in
    }
  }

  // Admin panel access logic
  if (adminId) {
    return element;
  } else {
    return <Navigate to="/login" replace />; // Redirect to admin login page if admin is not logged in
  }
}

function AppWithSidebarNavbar() {
  const location = useLocation();
  const adminId = sessionStorage.getItem("adminId");
  const staffId = sessionStorage.getItem("staffId");

  return (
    <main className="main" id="top">
      <div className="container" data-layout="container">
        {/* Show Sidebar for all pages except login pages */}
        {location.pathname !== "/login" && location.pathname !== "/staff/login" && (
          <Sidebar />
        )}
        <div className="content">
          {/* Show Navbar for all pages except login pages */}
          {location.pathname !== "/login" && location.pathname !== "/staff/login" && (
            <Navbar />
          )}
          <Routes>
            {/* Admin and Staff Private Routes */}
            <Route path="/" element={<PrivateRoute element={<Home />} allowedRoles={["admin"]} />} />
            <Route path="/Admin" element={<PrivateRoute element={<Adminread />} allowedRoles={["admin"]} />} />
            <Route path="/Role" element={<PrivateRoute element={<Roleread />} allowedRoles={["admin"]} />} />
            <Route path="/Employee" element={<PrivateRoute element={<Staffread />} allowedRoles={["admin"]} />} />
            <Route path="/Guest" element={<PrivateRoute element={<Guestread />} allowedRoles={["admin"]} />} />
            <Route path="/Roomtype" element={<PrivateRoute element={<Roomtype />} allowedRoles={["admin"]} />} />
            <Route path="/Room" element={<PrivateRoute element={<Roomread />} allowedRoles={["admin"]} />} />
            <Route path="/Floor" element={<PrivateRoute element={<Floorread />} allowedRoles={["admin"]} />} />
            <Route path="/Food" element={<PrivateRoute element={<Foodread />} allowedRoles={["admin"]} />} />
            <Route path="/Laundry" element={<PrivateRoute element={<LaundryRead />} allowedRoles={["admin"]} />} />
            <Route path="/Feedback" element={<PrivateRoute element={<Feedbackread />} allowedRoles={["admin"]} />} />
            <Route path="/bookingroom" element={<PrivateRoute element={<Bookingroom />} allowedRoles={["admin"]} />} />
            <Route path="/Staff/" element={<PrivateRoute element={<Booking />} allowedRoles={["receptionist"]} />} />
            <Route path="/Staff/Bookings" element={<PrivateRoute element={<Bookings />} allowedRoles={["receptionist"]} />} />
            <Route path="/Staff/FoodOrder" element={<PrivateRoute element={<FoodOrder />} allowedRoles={["receptionist"]} />} />
            <Route path="/Staff/Guests" element={<PrivateRoute element={<Guest />} allowedRoles={["receptionist"]} />} />
            <Route path="/Staff/Invoice/:id" element={<PrivateRoute element={<Invoice />} allowedRoles={["receptionist"]} />} />
            <Route path="Staff/Housekeeping/" element={<PrivateRoute element={<CleaningRooms />} allowedRoles={["housekeeping"]} />} />
            <Route path="/Staff/Manager/Analytics" element={<PrivateRoute element={<Analytics />} allowedRoles={["manager"]} />} />
            <Route path="/logout" element={<PrivateRoute element={<Logout />} allowedRoles={["admin", "manager", "receptionist", "housekeeping"]} />} />

            {/* Login Routes */}
            <Route
              path="/login"
              element={
                adminId ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login />
                )
              }
            />
            <Route
              path="/staff/login"
              element={
                staffId ? (
                  <Navigate to="/Staff/" replace />
                ) : (
                  <StaffLogin />
                )
              }
            />

            {/* Catch-all for unknown routes */}
            <Route path="*" element={<Notfound />} />
          </Routes>
        </div>
      </div>
    </main>
  );
}

export default App;
