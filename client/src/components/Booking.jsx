import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, Spin, message } from "antd";
import dayjs from "dayjs";

function Booking() {
  const url = "https://bookmyseat-backend.onrender.com";
  const user = useSelector((state) => state.users.user);
  const userId = user._id;

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${url}/api/booking/ticket/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const tickets = await response.json();

      // Fetch show details for each booking
      const detailedShows = await Promise.all(
        tickets.map(async (ticket) => {
          const res = await fetch(
            `${url}/api/show/${ticket.show}`,
            {
              method: "GET",
              credentials: "include",
            }
          );
          const showDetail = await res.json();

          return {
            ...ticket,
            showDetail,
          };
        })
      );

      setBookings(detailedShows);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      message.error("Failed to load bookings ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="px-2 py-6 sm:px-4">
      <h2 className="font-bold mb-5 text-lg sm:text-xl">
        🎟️ Your Booked Tickets
      </h2>
      {loading ? (
        <div className="flex justify-center py-10">
          <Spin size="large" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-center text-gray-500">No bookings yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {bookings.map((booking, idx) => {
            const { showDetail } = booking;
            return (
              <Card
                key={idx}
                title={showDetail.movie?.title || "Unknown Movie"}
                bordered
                className="w-full shadow-md rounded"
              >
                <p>
                  <span className="font-medium text-gray-700">Theatre:</span>{" "}
                  {showDetail.theatre?.name} ({showDetail.theatre?.location})
                </p>
                <p>
                  <span className="font-medium text-gray-700">Time:</span>{" "}
                  {dayjs(showDetail.time).format("DD MMM YYYY, hh:mm A")}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Language:</span> {showDetail.language}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Total Price:</span> Rs {booking.totalPrice}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Seats:</span>{" "}
                  {booking.seats.map((s) => s.seatNumber).join(", ")}
                </p>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Booking;
