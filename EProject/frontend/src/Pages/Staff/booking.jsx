import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [guests, setGuests] = useState([]);
  const [selectedGuest, setSelectedGuest] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [filterStatus, setFilterStatus] = useState("all"); // Filter state
  const [searchTerm, setSearchTerm] = useState(""); // Search term state
  const bookedBy = sessionStorage.getItem("staffId");
  const [expectedCheckin, setExpectedCheckin] = useState("");
  const [expectedCheckout, setExpectedCheckout] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  // Fetch initial data
  useEffect(() => {
    const staffId = sessionStorage.getItem("staffId");

    if (staffId) {
      // Fetch staff role
      fetch(`http://localhost:5000/api/staff/${staffId}`)
        .then((res) => res.json())
        .then((staffData) => {
          const staffRoleId = staffData.role;

          // Fetch roles and match
          fetch("http://localhost:5000/api/role/")
            .then((res) => res.json())
            .then((roles) => {
              const role = roles.find((r) => r._id === staffRoleId);

              if (role?.name === "housekeeping") {
                navigate("/Staff/Housekeeping");
              }
            })
            .catch((err) => console.error("Error fetching roles:", err));
        })
        .catch((err) => console.error("Error fetching staff data:", err));
    }
    // Fetch Room data
    fetch("http://localhost:5000/api/room/")
      .then((res) => res.json())
      .then((data) => setRooms(data))
      .catch((err) => console.error(err));

    // Fetch Room Type data
    fetch("http://localhost:5000/api/roomtype/")
      .then((res) => res.json())
      .then((data) => setRoomTypes(data))
      .catch((err) => console.error(err));

    // Fetch Guests data
    fetch("http://localhost:5000/api/guest")
      .then((res) => res.json())
      .then((data) => setGuests(data))
      .catch((err) => console.error(err));
  }, []);

  const handleBookNow = () => {
    if (
      !selectedRoom ||
      !selectedGuest ||
      !expectedCheckin ||
      !expectedCheckout
    ) {
      setMessage("All fields are required!");
      return;
    }

    const bookingData = {
      room: selectedRoom, // This should be the room ID
      bookfor: selectedGuest.value, // Guest ID
      bookedby: bookedBy, // Staff ID from sessionStorage
      expectedcheckin: expectedCheckin,
      expectedcheckout: expectedCheckout,
      paymentstatus: "unpaid" // Default payment status
    };

    fetch("http://localhost:5000/api/booking/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData)
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "An error occurred while booking.");
          });
        }
        return res.json();
      })
      .then((data) => {
        setMessage(data.message || "Booking successful!");
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.message);
      });
  };

  // Combine and sort Room and Room Type data
  const getRoomDetails = () => {
    const combinedRooms = rooms.map((room) => {
      const roomType = roomTypes.find((type) => type._id === room.type);
      return {
        ...room,
        roomType: roomType ? roomType.type : "Unknown",
        halfDayPrice: roomType ? roomType.halfdayprice : 0,
        fullDayPrice: roomType ? roomType.fulldayprice : 0
      };
    });

    // Filter by status
    const filteredRooms =
      filterStatus === "all"
        ? combinedRooms
        : combinedRooms.filter((room) => room.status === filterStatus);

    // Filter by search term
    const searchedRooms = filteredRooms.filter((room) => {
      const roomTypeMatch = room.roomType
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const roomNoMatch = room.roomno
        .toString()
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return roomTypeMatch || roomNoMatch;
    });

    // Sort by availability status and then by room number
    return searchedRooms.sort((a, b) => {
      const statusOrder = { available: 1, cleaning: 2, occupied: 3 };
      const statusComparison =
        (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);

      if (statusComparison !== 0) return statusComparison;
      return a.roomno - b.roomno;
    });
  };

  const roomDetails = getRoomDetails();

  // Transform guests into the format that React-Select expects
  const guestOptions = guests.map((guest) => ({
    value: guest._id, // Save guest's ID
    label: guest.email // Show guest's email
  }));

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Book Room</h1>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="statusFilter" className="form-label">
            Filter by Status
          </label>
          <select
            id="statusFilter"
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all" className="form-control">
              All
            </option>
            <option value="available" className="form-control">
              Available
            </option>
            <option value="cleaning" className="form-control">
              Cleaning
            </option>
            <option value="occupied" className="form-control">
              Occupied
            </option>
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="searchRooms" className="form-label">
            Search Rooms
          </label>
          <input
            type="text"
            id="searchRooms"
            className="form-control"
            placeholder="Search by room type or number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="row">
        {roomDetails.map((room) => (
          <div className="mb-4 col-md-6 col-lg-4" key={room._id}>
            <div className="border rounded-1 h-100 d-flex flex-column justify-content-between pb-3">
              <div className="overflow-hidden">
                <div className="position-relative rounded-top overflow-hidden">
                  <img
                    className="img-fluid rounded-top"
                    src="assets/img/room/room.jpg"
                    alt=""
                  />
                  {room.status === "occupied" && (
                    <span className="badge rounded-pill bg-danger position-absolute mt-2 me-2 z-2 top-0 end-0">
                      Occupied
                    </span>
                  )}
                  {room.status === "cleaning" && (
                    <span
                      className="badge rounded-pill bg-warning position-absolute mt-2 me-2 z-2 top-0 end-0"
                      title="Cleaning"
                    >
                      <i class="bx bxs-washer"></i>
                    </span>
                  )}
                  {room.status === "available" && (
                    <span className="badge rounded-pill bg-success position-absolute mt-2 me-2 z-2 top-0 end-0">
                      Available
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h5 className="fs-9">Room No. {room.roomno}</h5>
                  <p className="fs-10 mb-3">Room Type: {room.roomType}</p>
                  <h5 className="fs-md-7 text-warning mb-0 d-flex align-items-center mb-3">
                    ${room.fullDayPrice}
                  </h5>
                  <p className="fs-10 mb-1">
                    Half Day: <strong>${room.halfDayPrice}</strong>
                  </p>
                  {room.status === "available" && (
                    <button
                      className="btn btn-sm btn-falcon-default"
                      disabled={room.status !== "available"}
                      data-bs-toggle="modal"
                      data-bs-target="#bookingModal"
                      onClick={() => setSelectedRoom(room._id)}
                    >
                      <span className="fas fa-hotel"></span>
                    </button>
                  )}
                  {room.status === "occupied" && (
                    <button
                      className="btn btn-sm btn-falcon-default"
                      title="Check In"
                    >
                      <span className="bx bx-run"></span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
      <div
        className="modal fade"
        id="bookingModal"
        tabIndex="-1"
        aria-labelledby="bookingModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="bookingModalLabel">
                Complete Your Booking
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              {message && <div className="alert alert-info">{message}</div>}
              <form>
                {/* Guest Selection Dropdown */}
                <div className="mb-3">
                  <label htmlFor="bookFor" className="form-label">
                    Select Guest
                  </label>
                  <Select
                    id="bookFor"
                    options={guestOptions}
                    onChange={setSelectedGuest}
                    value={selectedGuest}
                    placeholder="Search and select guest"
                  />
                </div>

                {/* Expected Check-in */}
                <div className="mb-3">
                  <label htmlFor="expectedCheckin" className="form-label">
                    Expected Check-in
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="expectedCheckin"
                    value={expectedCheckin}
                    onChange={(e) => setExpectedCheckin(e.target.value)}
                  />
                </div>

                {/* Expected Check-out */}
                <div className="mb-3">
                  <label htmlFor="expectedCheckout" className="form-label">
                    Expected Check-out
                  </label>
                  <input
                    type="datetime-local"
                    className="form-control"
                    id="expectedCheckout"
                    value={expectedCheckout}
                    onChange={(e) => setExpectedCheckout(e.target.value)}
                  />
                </div>

                {/* Book Now Button */}
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={handleBookNow}
                >
                  Book Now
                </button>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;
