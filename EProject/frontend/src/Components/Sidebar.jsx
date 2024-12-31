import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();
  const adminId = sessionStorage.getItem("adminId");
  const staffId = sessionStorage.getItem("staffId");
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
          {adminId ? (
            <ul className="navbar-nav flex-column mb-3" id="navbarVerticalNav">
              <li className="nav-item">
                <div className="row navbar-vertical-label-wrapper mt-3 mb-2">
                  <div className="col-auto navbar-vertical-label">Pages</div>
                  <div className="col ps-0">
                    <hr className="mb-0 navbar-vertical-divider" />
                  </div>
                </div>
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
            <ul className="navbar-nav flex-column mb-3" id="navbarVerticalNav">
              <li className="nav-item">
                <div className="row navbar-vertical-label-wrapper mt-3 mb-2">
                  <div className="col-auto navbar-vertical-label">Pages</div>
                  <div className="col ps-0">
                    <hr className="mb-0 navbar-vertical-divider" />
                  </div>
                </div>
                
                <Link className="nav-link" to="/Staff/Housekeeping/" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">Cleaning</span>
                  </div>
                </Link>
                <Link className="nav-link" to="/Staff/FoodOrder/" role="button">
                  <div className="d-flex align-items-center">
                    <span className="nav-link-icon">
                      <span className="fas fa-flag" />
                    </span>
                    <span className="nav-link-text ps-1">FoodOrder</span>
                  </div>
                </Link>
              </li>
            </ul>
          ) : (
            <p>No valid session found.</p>
          )}
          </div>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
