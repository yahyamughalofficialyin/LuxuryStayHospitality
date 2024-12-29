import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from "moment";
import { Link } from "react-router-dom";

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [guests, setGuests] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingRes, roomRes, guestRes] = await Promise.all([
          axios.get("http://localhost:5000/api/booking"),
          axios.get("http://localhost:5000/api/room"),
          axios.get("http://localhost:5000/api/guest")
        ]);

        setBookings(bookingRes.data);
        setRooms(roomRes.data);
        setGuests(guestRes.data);
        setFilteredBookings(bookingRes.data); // Initialize filtered bookings
      } catch (error) {
        toast.error("Failed to fetch data. Please try again later.");
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const getRoomNumber = (roomId) => {
    const room = rooms.find((room) => room._id === roomId);
    return room ? room.roomno : "Unknown Room";
  };

  const getGuestName = (guestId) => {
    const guest = guests.find((guest) => guest._id === guestId);
    return guest ? guest.name : "Unknown Guest";
  };

  const getGuestEmailPhone = (guestId) => {
    const guest = guests.find((guest) => guest._id === guestId);
    return guest ? `${guest.email || "N/A"} - ${guest.phone || "N/A"}` : "N/A";
  };

  const formatDateTime = (dateTime) => {
    return dateTime ? moment(dateTime).format("YYYY-MM-DD HH:mm") : "N/A";
  };

  const getStatus = (checkin, checkout) => {
    if (!checkin && !checkout) return "Not Checked In";
    if (checkin && !checkout) return "Checked In";
    return "Checked Out";
  };

  const handleFilterChange = (status) => {
    setFilterStatus(status);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleAction = async (bookingId, action) => {
    const currentDateTime = new Date().toISOString(); // Get current date and time in the desired format

    try {
      const updatedBooking = await axios.put(
        `http://localhost:5000/api/booking/update/${bookingId}`,
        {
          [action]: currentDateTime,
        }
      );

      // Update bookings state to reflect changes
      setBookings((prevBookings) =>
        prevBookings.map((booking) =>
          booking._id === bookingId ? { ...booking, ...updatedBooking.data } : booking
        )
      );

      toast.success(`${action === "checkin" ? "Checkin" : "Checkout"} successful.`);
    } catch (error) {
      toast.error(`Failed to ${action}. Please try again later.`);
      console.error(`Error during ${action}:`, error);
    }
  };

  useEffect(() => {
    const filtered = bookings.filter((booking) => {
      const guest = guests.find((guest) => guest._id === booking.bookfor);
      const guestMatches =
        guest &&
        (guest.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          guest.phone?.includes(searchTerm));
      const statusMatches =
        filterStatus === "All" ||
        getStatus(booking.checkin, booking.checkout) === filterStatus;

      return guestMatches && statusMatches;
    });

    setFilteredBookings(filtered);
  }, [bookings, guests, filterStatus, searchTerm]);

  return (
    <>
      <div className="card mb-3" id="feedbackTable">
        <div className="card-header">
          <div className="row flex-between-center">
            <div className="col-3 col-sm-auto d-flex align-items-center pe-0">
              <h5 className="fs-9 mb-0 text-nowrap py-2 py-xl-0">Bookings</h5>
            </div>
            <div className="col-3 col-sm-auto">
              <select
                className="form-select"
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Not Checked In">Not Checked In</option>
                <option value="Checked In">Checked In</option>
                <option value="Checked Out">Checked Out</option>
              </select>
            </div>
            <div className="col-3 col-sm-auto">
              <input
                className="form-control"
                type="text"
                placeholder="Search by email or phone"
                value={searchTerm}
                onChange={handleSearch}
              />
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          <div className="table-responsive scrollbar">
            <table className="table table-sm table-striped fs-10 mb-0 overflow-hidden">
              <thead className="bg-200">
                <tr>
                  <th>#</th>
                  <th>Room No</th>
                  <th>Booked For</th>
                  <th>Guest Details</th>
                  <th>Check In</th>
                  <th>Check Out</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((booking, index) => (
                  <tr key={booking._id}>
                    <td>{index + 1}</td>
                    <td>{getRoomNumber(booking.room)}</td>
                    <td>{getGuestName(booking.bookfor)}</td>
                    <td>{getGuestEmailPhone(booking.bookfor)}</td>
                    <td>{formatDateTime(booking.checkin)}</td>
                    <td>{formatDateTime(booking.checkout)}</td>
                    <td>
                      <span
                        className={`badge rounded-pill bg-${
                          getStatus(booking.checkin, booking.checkout) ===
                          "Not Checked In"
                            ? "warning"
                            : getStatus(booking.checkin, booking.checkout) ===
                              "Checked In"
                            ? "info"
                            : "success"
                        }`}
                      >
                        {getStatus(booking.checkin, booking.checkout)}
                      </span>
                    </td>
                    <td className="py-2 align-middle white-space-nowrap text-end">
                      <div className="dropdown font-sans-serif position-static">
                        <button
                          className="btn btn-link text-600 btn-sm dropdown-toggle btn-reveal"
                          type="button"
                          id={`feedback-dropdown-${index}`}
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <span className="fas fa-ellipsis-h fs-10"></span>
                        </button>
                        <div
                          className="dropdown-menu dropdown-menu-end border py-0"
                          aria-labelledby={`feedback-dropdown-${index}`}
                        >
                          <div className="py-2">
                            {((booking.checkin === null) && (booking.checkout === null)) && (
                              <button
                                className="dropdown-item"
                                onClick={() => handleAction(booking._id, "checkin")}
                              >
                                Checkin
                              </button>
                            )}
                            {((booking.checkin !== null) && (booking.checkout === null)) && (
                              <button
                                className="dropdown-item"
                                onClick={() => handleAction(booking._id, "checkout")}
                              >
                                Checkout
                              </button>
                            )}
                            <Link className="dropdown-item">View</Link>
                            <div className="dropdown-divider"></div>
                            <Link className="dropdown-item text-primary">
                              Bill
                            </Link>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Toast notifications */}
      <ToastContainer />
    </>
  );
};

export default Bookings;
