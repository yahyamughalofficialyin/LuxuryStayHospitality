import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const staffId = sessionStorage.getItem("staffId"); // Example: fetching staffId from sessionStorage
  const [roleName, setRoleName] = useState(null);

  useEffect(() => {
    const fetchRole = async () => {
      if (!staffId) return;

      try {
        // Fetch staff details
        const staffResponse = await fetch(
          `http://localhost:5000/api/staff/${staffId}`
        );
        const staffData = await staffResponse.json();
        const roleId = staffData.role;

        // Fetch role details
        const roleResponse = await fetch(
          `http://localhost:5000/api/role/${roleId}`
        );
        const roleData = await roleResponse.json();

        // Update role name
        setRoleName(roleData.name);
      } catch (error) {
        console.error("Error fetching role details:", error);
      }
    };

    fetchRole();
  }, [staffId]);

  // Check if the current URL contains '/Staff/' and the session has 'staffId'
  const isStaff = location.pathname.includes("/Staff/") && staffId;
  return (
    <>
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
              <img
                className="me-2"
                src="./assets/img/hotel.svg"
                alt=""
                width={150}
              />
            </div>
          </Link>
        </div>
        <div className="collapse navbar-collapse" id="navbarVerticalCollapse">
          <div className="navbar-vertical-content scrollbar">
            {roleName === "housekeeping" ? (
              <ul
                className="navbar-nav flex-column mb-3"
                id="navbarVerticalNav"
              >
                <li className="nav-item">
                  {/* label */}
                  <div className="row navbar-vertical-label-wrapper mt-3 mb-2">
                    <div className="col-auto navbar-vertical-label">Pages</div>
                    <div className="col ps-0">
                      <hr className="mb-0 navbar-vertical-divider" />
                    </div>
                  </div>
                  {/* parent pages */}
                  <Link
                    className="nav-link"
                    to="/Staff/Housekeeping"
                    role="button"
                  >
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon">
                        <span className="fas fa-flag" />
                      </span>
                      <span className="nav-link-text ps-1">Rooms To Clean</span>
                    </div>
                  </Link>
                </li>
              </ul>
            ) : isStaff ? (
              <ul
                className="navbar-nav flex-column mb-3"
                id="navbarVerticalNav"
              >
                <li className="nav-item">
                  {/* label */}
                  <div className="row navbar-vertical-label-wrapper mt-3 mb-2">
                    <div className="col-auto navbar-vertical-label">Pages</div>
                    <div className="col ps-0">
                      <hr className="mb-0 navbar-vertical-divider" />
                    </div>
                  </div>
                  {/* staff-specific pages */}
                  <Link className="nav-link" to="/Staff/" role="button">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon">
                        <span className="fas fa-user" />
                      </span>
                      <span className="nav-link-text ps-1">Book Room</span>
                    </div>
                  </Link>
                  <Link className="nav-link" to="/Staff/Guests" role="button">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon">
                        <span className="fas fa-users" />
                      </span>
                      <span className="nav-link-text ps-1">Guests</span>
                    </div>
                  </Link>
                  <Link className="nav-link" to="/Bookings" role="button">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon">
                        <span className="fas fa-user-circle" />
                      </span>
                      <span className="nav-link-text ps-1">Bookings</span>
                    </div>
                  </Link>
                  <Link className="nav-link" to="/FoodOrder" role="button">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon">
                        <span className="fas fa-flag" />
                      </span>
                      <span className="nav-link-text ps-1">Order Food</span>
                    </div>
                  </Link>
                </li>
              </ul>
            ) : (
              <ul
                className="navbar-nav flex-column mb-3"
                id="navbarVerticalNav"
              >
                <li className="nav-item">
                  {/* label */}
                  <div className="row navbar-vertical-label-wrapper mt-3 mb-2">
                    <div className="col-auto navbar-vertical-label">Pages</div>
                    <div className="col ps-0">
                      <hr className="mb-0 navbar-vertical-divider" />
                    </div>
                  </div>
                  {/* default pages */}
                  <Link className="nav-link" to="/Staff/" role="button">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon">
                        <span className="fas fa-user" />
                      </span>
                      <span className="nav-link-text ps-1">Book Room</span>
                    </div>
                  </Link>
                  <Link className="nav-link" to="/Staff" role="button">
                    <div className="d-flex align-items-center">
                      <span className="nav-link-icon">
                        <span className="fas fa-users" />
                      </span>
                      <span className="nav-link-text ps-1">Staff</span>
                    </div>
                  </Link>
                </li>
              </ul>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
