import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

const Sidebar = () => {
  const location = useLocation();
  const staffId = sessionStorage.getItem("staffId");
  const adminId = sessionStorage.getItem("adminId");
  const [staffRoleName, setStaffRoleName] = useState("");

  useEffect(() => {
    const fetchRoleName = async () => {
      if (staffId) {
        try {
          // Fetch staff details
          const staffResponse = await axios.get(`http://localhost:5000/api/staff/${staffId}`);
          const staffRoleId = staffResponse.data.role;

          // Fetch role details
          const roleResponse = await axios.get("http://localhost:5000/api/role/");
          const matchedRole = roleResponse.data.find(role => role._id === staffRoleId);

          if (matchedRole) {
            setStaffRoleName(matchedRole.name);
          }
        } catch (error) {
          console.error("Error fetching staff role details:", error);
        }
      }
    };

    fetchRoleName();
  }, [staffId]);

  return (
    <nav className="navbar navbar-light navbar-vertical navbar-expand-xl">
      <div className="d-flex align-items-center">
        <div className="toggle-icon-wrapper">
          <button
            className="btn navbar-toggler-humburger-icon navbar-vertical-toggle"
            data-bs-toggle="tooltip"
            data-bs-placement="left"
            title="Toggle Navigation"
          >
            <span className="navbar-toggle-icon">
              <span className="toggle-line" />
            </span>
          </button>
        </div>
        <Link className="navbar-brand" to="/">
          <div className="d-flex align-items-center py-3">
            <img className="me-2" src="./assets/img/hotel.svg" alt="" width={150} />
          </div>
        </Link>
      </div>
      <div className="collapse navbar-collapse" id="navbarVerticalCollapse">
        <div className="navbar-vertical-content scrollbar">
          {adminId ? (
            // Admin links
            <ul className="navbar-nav flex-column mb-3" id="navbarVerticalNav">
              <li className="nav-item">
                <Link className="nav-link" to="/Admin" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">Admin</span>
                  </div>
                </Link>
                
                <Link className="nav-link" to="/Feedback" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">Feedback</span>
                  </div>
                </Link>
                <Link className="nav-link" to="/Floor" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">Floor</span>
                  </div>
                </Link>

                <Link className="nav-link" to="/Room" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">Room</span>
                  </div>
                </Link>
                
                <Link className="nav-link" to="/Food" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">Food</span>
                  </div>
                </Link>
                
                <Link className="nav-link" to="/Laundry" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">Laundry</span>
                  </div>
                </Link>

                <Link className="nav-link" to="/Employee" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">Employee</span>
                  </div>
                </Link>
                
                <Link className="nav-link" to="/Role" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">Role</span>
                  </div>
                </Link>
                
                <Link className="nav-link" to="/Roomtype" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">Room Type</span>
                  </div>
                </Link>
              </li>
            </ul>
          ) : staffId ? (
            // Staff links
            <ul className="navbar-nav flex-column mb-3" id="navbarVerticalNav">
              <li className="nav-item">
                {staffRoleName === "housekeeping" ? (
                  <Link className="nav-link" to="/Staff/Housekeeping" role="button">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon">
                        <span className="fas fa-flag" />
                      </span>
                      <span className="nav-link-text ps-1">Cleaning</span>
                    </div>
                  </Link>
                ) : (
                  <>
                    <Link className="nav-link" to="/Staff/" role="button">
                      <div className="d-flex align-items-center">
                        <span className="nav-link-icon">
                          <span className="fas fa-flag" />
                        </span>
                        <span className="nav-link-text ps-1">Book a New Room</span>
                      </div>
                    </Link>
                    <Link className="nav-link" to="/Staff/Bookings" role="button">
                      <div className="d-flex align-items-center">
                        <span className="nav-link-icon">
                          <span className="fas fa-flag" />
                        </span>
                        <span className="nav-link-text ps-1">Bookings</span>
                      </div>
                    </Link>
                    <Link className="nav-link" to="/Staff/Guests" role="button">
                      <div className="d-flex align-items-center">
                        <span className="nav-link-icon">
                          <span className="fas fa-flag" />
                        </span>
                        <span className="nav-link-text ps-1">Guests</span>
                      </div>
                    </Link>
                    <Link className="nav-link" to="/Staff/FoodOrder/" role="button">
                      <div className="d-flex align-items-center">
                        <span className="nav-link-icon">
                          <span className="fas fa-flag" />
                        </span>
                        <span className="nav-link-text ps-1">Food Order</span>
                      </div>
                    </Link>
                  </>
                )}
              </li>
            </ul>
          ) : (
            <p>No valid session found.</p>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
