import React, { useEffect, useState } from "react";
import Select from "react-select";
import { useNavigate } from "react-router-dom";

const FoodOrder = () => {
  const [foods, setFoods] = useState([]);
  const [foodTypes, setFoodTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("all"); // Filter by type
  const [searchTerm, setSearchTerm] = useState(""); // Search term
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1); // Quantity state
  const [roomOptions, setRoomOptions] = useState([]); // Filtered occupied rooms
  const [selectedRoom, setSelectedRoom] = useState(""); // Room selection
  const [orderType, setOrderType] = useState("dinein"); // Order type
  const [guestOptions, setGuestOptions] = useState([]); // Guest dropdown
  const [selectedGuest, setSelectedGuest] = useState(""); // Guest selection
  const [selectedFood, setSelectedFood] = useState(null); // Track selected food for the modal
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
    // Fetch food data
    fetch("http://localhost:5000/api/food/")
      .then((res) => res.json())
      .then((data) => setFoods(data))
      .catch((err) => console.error(err));

    // Food types (manually set or fetched)
    setFoodTypes(["all", "breakfast", "starter", "main", "deserts", "beverages"]);

    // Fetch room data and filter by status
    fetch("http://localhost:5000/api/room/")
      .then((res) => res.json())
      .then((data) => {
        const occupiedRooms = data.filter((room) => room.status === "occupied");
        setRoomOptions(occupiedRooms.map((room) => ({ value: room._id, label: room.roomno })));
      })
      .catch((err) => console.error(err));

    // Fetch guest data
    fetch("http://localhost:5000/api/guest/")
      .then((res) => res.json())
      .then((data) => {
        setGuestOptions(data.map((guest) => ({ value: guest._id, label: guest.name })));
      })
      .catch((err) => console.error(err));
  }, []);

  // Calculate bill
  const getBillAmount = (food) => quantity * food.price;

  // Handle placing the order
  const handleOrderNow = () => {
    if (!selectedFood) {
      setMessage("Please select a food item.");
      return;
    }

    const bill = getBillAmount(selectedFood);

    const orderData = {
      foodid: selectedFood._id,
      quantity: quantity,
      status: "received",
      paymentstatus: "unpaid",
      type: orderType,
      ordertime: new Date().toISOString(),
      room: orderType === "roomserve" ? selectedRoom : "", // Only send room for roomserve
      orderby: selectedGuest, // Guest ID
      bill: bill,
    };

    fetch("http://localhost:5000/api/foodorder/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(orderData),
    })
      .then((res) => res.json())
      .then(() => setMessage(`Order for ${selectedFood.name} has been placed successfully.`))
      .catch((err) => console.error(err));
  };

  // Filter and search foods
  const filteredFoods = foods
    .filter((food) => selectedType === "all" || food.type === selectedType)
    .filter((food) => food.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">Food Menu</h1>

      {/* Filters */}
      <div className="row mb-4">
        <div className="col-md-6">
          <label htmlFor="typeFilter" className="form-label">Filter by Type</label>
          <select
            id="typeFilter"
            className="form-select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            {foodTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label htmlFor="searchFood" className="form-label">Search Food</label>
          <input
            type="text"
            id="searchFood"
            className="form-control"
            placeholder="Search by food name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Food List */}
      <div className="row">
        {filteredFoods.length > 0 ? (
          filteredFoods.map((food) => (
            <div className="mb-4 col-md-6 col-lg-4" key={food._id}>
            <div className="border rounded-1 h-100 d-flex flex-column justify-content-between pb-3">
              <div className="overflow-hidden">
                <div className="position-relative rounded-top overflow-hidden">
                  <img
                    className="img-fluid rounded-top"
                    src="assets/img/food/food.jpg"
                    alt={food.name}
                  />
                  {food.quantity === 0 && (
                    <span className="badge rounded-pill bg-danger position-absolute mt-2 me-2 z-2 top-0 end-0">
                      Out of Stock
                    </span>
                  )}
                  {food.quantity > 0 && (
                    <span className="badge rounded-pill bg-success position-absolute mt-2 me-2 z-2 top-0 end-0">
                      In Stock
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <h5 className="fs-9">{food.name}</h5>
                  <p className="fs-10 mb-3">Type: {food.type}</p>
                  <h5 className="fs-md-7 text-warning mb-0">${food.price}</h5>
                  <p className="fs-10 mb-1">
                    Available: <strong>{food.quantity}</strong> items
                  </p>
                  <button
                    className="btn btn-sm btn-falcon-primary"
                    data-bs-toggle="modal"
                    data-bs-target="#orderModal"
                    onClick={() => setSelectedFood(food)} // Store selected food
                  >
                    Order Now
                  </button>
                </div>
              </div>
            </div>
          </div>
          ))
        ) : (
          <div className="col-12">
            <p>No food items found.</p>
          </div>
        )}
      </div>

      {/* Success Message */}
      {message && <div className="alert alert-info mt-4">{message}</div>}

      {/* Order Modal */}
      <div
        className="modal fade"
        id="orderModal"
        tabIndex="-1"
        aria-labelledby="orderModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="orderModalLabel">Place Your Order</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              {/* Quantity Input */}
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Quantity</label>
                <input
                  type="number"
                  id="quantity"
                  className="form-control"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  min="1"
                />
              </div>

              {/* Order Type */}
              <div className="mb-3">
                <label htmlFor="orderType" className="form-label">Order Type</label>
                <select
                  id="orderType"
                  className="form-select"
                  value={orderType}
                  onChange={(e) => setOrderType(e.target.value)}
                >
                  <option value="dinein">Dine-in</option>
                  <option value="takeaway">Takeaway</option>
                  <option value="roomserve">Room Service</option>
                </select>
              </div>

              {/* Room Selection */}
              {orderType === "roomserve" && (
                <div className="mb-3">
                  <label htmlFor="room" className="form-label">Room</label>
                  <Select
                    id="room"
                    options={roomOptions}
                    value={roomOptions.find((room) => room.value === selectedRoom)}
                    onChange={(option) => setSelectedRoom(option.value)}
                  />
                </div>
              )}

              {/* Guest Selection */}
              <div className="mb-3">
                <label htmlFor="guest" className="form-label">Select Guest</label>
                <Select
                  id="guest"
                  options={guestOptions}
                  value={guestOptions.find((guest) => guest.value === selectedGuest)}
                  onChange={(option) => setSelectedGuest(option.value)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-primary" onClick={handleOrderNow}>
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodOrder;
