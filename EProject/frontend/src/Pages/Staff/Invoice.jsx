import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const Invoice = () => {
  const { id } = useParams();
  const [guestDetails, setGuestDetails] = useState({});
  const [unpaidBookings, setUnpaidBookings] = useState([]);
  const [rooms, setRooms] = useState({});
  const [foodOrders, setFoodOrders] = useState([]);
  const [foodItems, setFoodItems] = useState({});
  const [currentDate, setCurrentDate] = useState("");

  const formatDate = (date) => {
    const suffixes = ["th", "st", "nd", "rd"];
    const day = date.getDate();
    const daySuffix =
      day % 10 >= 1 && day % 10 <= 3 && ![11, 12, 13].includes(day % 100)
        ? suffixes[day % 10]
        : suffixes[0];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${day}${daySuffix} ${monthNames[date.getMonth()]} ${date.getFullYear()}`;
  };

  useEffect(() => {
    // Set current date in desired format
    const today = new Date();
    setCurrentDate(formatDate(today));

    fetch(`http://localhost:5000/api/guest/${id}`)
      .then((res) => res.json())
      .then((data) => setGuestDetails(data))
      .catch((err) => console.error("Error fetching guest details:", err));

    // Fetch bookings for the guest
    fetch(`http://localhost:5000/api/booking/guest/${id}`)
      .then((res) => res.json())
      .then((bookings) => {
        const unpaid = bookings.filter((booking) => booking.paymentstatus === "unpaid");
        setUnpaidBookings(unpaid);

        // Fetch room details for unpaid bookings
        const roomIds = [...new Set(unpaid.map((booking) => booking.room))];
        Promise.all(
          roomIds.map((roomId) =>
            fetch(`http://localhost:5000/api/room/${roomId}`)
              .then((res) => res.json())
              .catch((err) => console.error("Error fetching room details:", err))
          )
        ).then((roomsData) => {
          const roomMap = {};
          roomsData.forEach((room) => {
            roomMap[room._id] = room.roomno;
          });
          setRooms(roomMap);
        });
      })
      .catch((err) => console.error("Error fetching bookings:", err));

    // Fetch food orders for the guest with unpaid status
    fetch(`http://localhost:5000/api/foodorder/guest/${id}`)
      .then((res) => res.json())
      .then((orders) => {
        const unpaidOrders = orders.filter((order) => order.paymentstatus === "unpaid");
        setFoodOrders(unpaidOrders);

        // Fetch food details based on foodid
        const foodIds = [...new Set(unpaidOrders.map((order) => order.foodid))];
        Promise.all(
          foodIds.map((foodId) =>
            fetch(`http://localhost:5000/api/food/${foodId}`)
              .then((res) => res.json())
              .catch((err) => console.error("Error fetching food details:", err))
          )
        ).then((foodData) => {
          const foodMap = {};
          foodData.forEach((food) => {
            foodMap[food._id] = food;
          });
          setFoodItems(foodMap);
        });
      })
      .catch((err) => console.error("Error fetching food orders:", err));
  }, [id]);

  return (
    <>
      <div className="card mb-3">
        <div className="card-body">
          <div className="row justify-content-between align-items-center">
            <div className="col-md">
              <h5 className="mb-2 mb-md-0">Order Summary for Guest</h5>
            </div>
            <div className="col-auto">
              <button className="btn btn-falcon-default btn-sm me-1 mb-2 mb-sm-0" type="button">
                <span className="fas fa-arrow-down me-1"> </span>Download (.pdf)
              </button>
              <button className="btn btn-falcon-default btn-sm me-1 mb-2 mb-sm-0" type="button">
                <span className="fas fa-print me-1"> </span>Print
              </button>
              <button className="btn btn-falcon-success btn-sm mb-2 mb-sm-0" type="button">
                <span className="fas fa-dollar-sign me-1"></span>Receive Payment
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="card">
        <div className="card-body">
          <div className="row align-items-center text-center mb-3">
            <div className="col-sm-6 text-sm-start">
              <img src="assets/img/hotel.svg" alt="invoice" width="250" />
            </div>
            <div className="col text-sm-end mt-3 mt-sm-0">
              <h2 className="mb-3">Invoice</h2>
              <h5>Luxury Stay Hospitality</h5>
              <p className="fs-10 mb-0">
                Aptech North Nazimabad
                <br />
                Karachi
              </p>
            </div>
            <div className="col-12">
              <hr />
            </div>
          </div>
          <div className="row align-items-center">
            <div className="col">
              <h6 className="text-500">Invoice to</h6>
              <h5>{guestDetails.name || "Guest Name"}</h5>
              <p className="fs-10">
                <a href={`mailto:${guestDetails.email}`}>{guestDetails.email || "guest@mail.com"}</a>
                <br />
                <a href={`tel:${guestDetails.phone}`}>{guestDetails.phone || "021123456789"}</a>
              </p>
            </div>
            <div className="col-sm-auto ms-auto">
              <div className="table-responsive">
                <table className="table table-sm table-borderless fs-10">
                  <tbody>
                    <tr>
                      <th className="text-sm-end">Invoice No:</th>
                      <td>14</td>
                    </tr>
                    <tr>
                      <th className="text-sm-end">Order Number:</th>
                      <td>AD20294</td>
                    </tr>
                    <tr>
                      <th className="text-sm-end">Invoice Date:</th>
                      <td>{currentDate}</td>
                    </tr>
                    <tr className="alert alert-warning fw-bold">
                      <th className="text-warning-emphasis text-sm-end">Status:</th>
                      <td className="text-warning-emphasis">Unpaid</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="table-responsive scrollbar mt-4 fs-10">
            <table className="table table-striped border-bottom">
              <thead>
                <tr className="bg-primary dark__bg-1000">
                  <th className="text-white border-0">Rooms</th>
                  <th className="text-white border-0 text-center">Duration</th>
                  <th className="text-white border-0 text-end">Rate</th>
                  <th className="text-white border-0 text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {unpaidBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="align-middle">
                      <h6 className="mb-0 text-nowrap">Room {rooms[booking.room] || "N/A"}</h6>
                    </td>
                    <td className="align-middle text-center">{booking.staytime}</td>
                    <td className="align-middle text-end">${booking.bill / 2 || "N/A"}</td>
                    <td className="align-middle text-end">${booking.bill}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="table-responsive scrollbar mt-4 fs-10">
            <table className="table table-striped border-bottom">
              <thead data-bs-theme="light">
                <tr className="bg-primary dark__bg-1000">
                  <th className="text-white border-0">Food</th>
                  <th className="text-white border-0 text-center">Quantity</th>
                  <th className="text-white border-0 text-end">Rate</th>
                  <th className="text-white border-0 text-end">Amount</th>
                </tr>
              </thead>
              <tbody>
                {foodOrders.map((order) => {
                  const food = foodItems[order.foodid];
                  return (
                    <tr key={order._id}>
                      <td className="align-middle">
                        <h6 className="mb-0 text-nowrap">{food?.name || "N/A"}</h6>
                      </td>
                      <td className="align-middle text-center">{order.quantity}</td>
                      <td className="align-middle text-end">${food?.price || "N/A"}</td>
                      <td className="align-middle text-end">${order.bill}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="container mt-5 mb-5"></div>
          <div className="row justify-content-end">
            <div className="col-auto">
              <table className="table table-sm table-borderless fs-10 text-end">
                <tr className="border-top">
                  <th className="text-900">Total:</th>
                  <td className="fw-semi-bold">
                    $
                    {unpaidBookings.reduce((total, booking) => total + booking.bill, 0) +
                      foodOrders.reduce((total, order) => total + order.bill, 0)}
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </div>
        <div className="card-footer bg-body-tertiary">
          <p className="fs-10 mb-0">
            Designed and Developed By{" "}
            <Link to="http://www.shaheencodecrafters.com/">Shaheen Code Crafters</Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Invoice;
