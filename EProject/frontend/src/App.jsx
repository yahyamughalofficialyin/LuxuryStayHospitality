import React from "react";
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

function App() {
  return (
    <BrowserRouter>
      <AppWithSidebarNavbar />
    </BrowserRouter>
  );
}

function PrivateRoute({ element, allowStaff }) {
  const isLoggedIn = sessionStorage.getItem("adminId");
  const location = useLocation();

  // Allow access to /staff/* routes even if not logged in
  if (allowStaff && location.pathname.startsWith("/staff/")) {
    return element;
  }

  // Restrict access to other routes if not logged in
  return isLoggedIn ? element : <Navigate to="/login" replace />;
}

function AppWithSidebarNavbar() {
  const location = useLocation();
  const isLoggedIn = sessionStorage.getItem("adminId");

  return (
    <main className="main" id="top">
      <div className="container" data-layout="container">
        {location.pathname !== "/login" && location.pathname !== "/staff/login" && (
          <>
            <Sidebar />
          </>
        )}
        <div className="content">
        {location.pathname !== "/login" && location.pathname !== "/staff/login" && (
          <>
            <Navbar />
          </>
        )}
          <Routes>
            <Route path="/" element={<PrivateRoute element={<Home />} />} />
            <Route path="/Admin" element={<PrivateRoute element={<Adminread />} />} />
            <Route path="/Role" element={<PrivateRoute element={<Roleread />} />} />
            <Route path="/Staff" element={<PrivateRoute element={<Staffread />} />} />
            <Route path="/Guest" element={<PrivateRoute element={<Guestread />} />} />
            <Route path="/Roomtype" element={<PrivateRoute element={<Roomtype />} />} />
            <Route path="/Room" element={<PrivateRoute element={<Roomread />} />} />
            <Route path="/Floor" element={<PrivateRoute element={<Floorread />} />} />
            <Route path="/Food" element={<PrivateRoute element={<Foodread />} />} />
            <Route path="/Laundry" element={<PrivateRoute element={<LaundryRead />} />} />
            <Route path="/Feedback" element={<PrivateRoute element={<Feedbackread />} />} />
            <Route path="/bookingroom" element={<PrivateRoute element={<Bookingroom />} />} />
            <Route path="/Staff/BookRoom" element={<PrivateRoute element={<Booking />} />} />
            <Route path="/Staff/Bookings" element={<PrivateRoute element={<Bookings/>} />} />
            <Route path="/logout" element={<PrivateRoute element={<Logout />} />} />

            {/* Login Routes */}
            <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login />} />
            <Route
              path="/staff/login"
              element={<PrivateRoute element={<StaffLogin />} allowStaff={true} />}
            />

            {/* Allow all /staff/* routes */}
            <Route path="/staff/*" element={<PrivateRoute element={<Notfound />} allowStaff={true} />} />

            {/* Catch-all for unknown routes */}
            <Route path="*" element={<Notfound />} />
          </Routes>
        </div>
      </div>
    </main>
  );
}

export default App;
