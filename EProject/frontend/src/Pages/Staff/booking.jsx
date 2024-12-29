import React, { useEffect, useState } from "react";

const Booking = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookFor, setBookFor] = useState("");
  const [bookedBy, setBookedBy] = useState("");
  const [expectedCheckin, setExpectedCheckin] = useState("");
  const [expectedCheckout, setExpectedCheckout] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
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
  }, []);

  const handleBookNow = () => {
    if (!selectedRoom || !bookFor || !bookedBy || !expectedCheckin || !expectedCheckout) {
      setMessage("All fields are required!");
      return;
    }

    const bookingData = {
      room: selectedRoom,
      bookfor: bookFor,
      bookedby: bookedBy,
      expectedcheckin: expectedCheckin,
      expectedcheckout: expectedCheckout,
    };

    fetch("http://localhost:5000/api/booking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bookingData),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.message) setMessage(data.message);
        else setMessage("Booking successful!");
      })
      .catch((err) => {
        console.error(err);
        setMessage("An error occurred while booking.");
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
        fullDayPrice: roomType ? roomType.fulldayprice : 0,
      };
    });

    // Sort by availability status and then by room number
    return combinedRooms.sort((a, b) => {
      const statusOrder = { available: 1, cleaning: 2, occupied: 3 };
      const statusComparison =
        (statusOrder[a.status] || 4) - (statusOrder[b.status] || 4);

      if (statusComparison !== 0) return statusComparison;
      return a.roomno - b.roomno;
    });
  };

  const roomDetails = getRoomDetails();

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Room Booking</h1>
      {message && <div className="alert alert-info">{message}</div>}

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
                    <span className="badge rounded-pill bg-warning position-absolute mt-2 me-2 z-2 top-0 end-0">
                      Cleaning
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
                  <button
                        className="btn btn-sm btn-falcon-default"
                    disabled={room.status !== "available"}
                    data-bs-toggle="modal"
                    data-bs-target="#bookingModal"
                    onClick={() => setSelectedRoom(room._id)}
                  >
                    <span className='fas fa-hotel'></span>
                  </button>
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
              <form>
                <div className="mb-3">
                  <label htmlFor="bookFor" className="form-label">
                    Guest ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bookFor"
                    value={bookFor}
                    onChange={(e) => setBookFor(e.target.value)}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="bookedBy" className="form-label">
                    Staff ID
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="bookedBy"
                    value={bookedBy}
                    onChange={(e) => setBookedBy(e.target.value)}
                  />
                </div>
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
