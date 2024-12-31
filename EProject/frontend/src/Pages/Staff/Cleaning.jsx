import React, { useEffect, useState } from "react";

const CleaningRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Fetch room types
    fetch("http://localhost:5000/api/roomtype/")
      .then((res) => res.json())
      .then((data) => setRoomTypes(data))
      .catch((err) => console.error(err));

    // Fetch rooms with cleaning status
    fetch("http://localhost:5000/api/room/")
      .then((res) => res.json())
      .then((data) => {
        // Filter rooms by status
        const cleaningRooms = data.filter((room) => room.status === "cleaning");
        setRooms(cleaningRooms);
      })
      .catch((err) => console.error(err));
  }, []);

  // Add roomtype.type to the rooms after fetching roomtypes
  useEffect(() => {
    if (rooms.length > 0 && roomTypes.length > 0) {
      const updatedRooms = rooms.map((room) => {
        const matchedType = roomTypes.find(
          (type) => type.id === room.roomtype
        );
        return {
          ...room,
          type: matchedType ? matchedType.type : "Unknown",
        };
      });
      setRooms(updatedRooms);
    }
  }, [rooms, roomTypes]);

  const handleMarkAvailable = (roomId) => {
    const updatedData = {
      available: "yes",
      status: "available",
    };

    fetch(`http://localhost:5000/api/room/update/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedData),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            throw new Error(data.message || "Failed to update the room.");
          });
        }
        return res.json();
      })
      .then((data) => {
        setMessage(data.message || "Room updated successfully!");
        setRooms((prevRooms) =>
          prevRooms.filter((room) => room._id !== roomId)
        ); // Remove updated room from the list
      })
      .catch((err) => {
        console.error(err);
        setMessage(err.message);
      });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Rooms to Clean</h1>
      {message && <div className="alert alert-info">{message}</div>}

      <div className="row">
        {rooms.map((room) => (
          <div className="mb-4 col-md-6 col-lg-4" key={room._id}>
            <div className="border rounded-1 h-100 d-flex flex-column justify-content-between pb-3">
              <div className="overflow-hidden">
                <div className="position-relative rounded-top overflow-hidden">
                  <img
                    className="img-fluid rounded-top"
                    src="assets/img/room/room.jpg"
                    alt=""
                  />
                  <span
                    className="badge rounded-pill bg-warning position-absolute mt-2 me-2 z-2 top-0 end-0"
                    title="Cleaning"
                  >
                    Cleaning
                  </span>
                </div>
                <div className="p-3">
                  <h5 className="fs-9">Room No. {room.roomno}</h5>
                  <p className="fs-10 mb-3">Room Type: {room.type}</p>
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleMarkAvailable(room._id)}
                  >
                    Cleaning Done
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CleaningRooms;
