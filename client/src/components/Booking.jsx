import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, Spin, message } from "antd";
import dayjs from "dayjs";

function Booking() {
  const url = "https://bookmyseat-backend.onrender.com";
  const user = useSelector((state) => state.users.user);
  const userId = user?._id;
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      if (!userId) return;
      setLoading(true);

      const token = localStorage.getItem("authToken");
      const res = await fetch(`${url}/api/booking/ticket/${userId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        console.error(`❌ Failed to fetch bookings (${res.status})`);
        message.error("Failed to load bookings ❌");
        return;
      }

      let tickets;
      try {
        tickets = await res.json();
      } catch (err) {
        console.error("❌ Invalid JSON from booking API:", err);
        message.error("Invalid booking data received ❌");
        return;
      }

      // ✅ Fetch each show's detail safely
      const detailedShows = await Promise.all(
        tickets.map(async (ticket) => {
          try {
            const showRes = await fetch(`${url}/api/show/${ticket.show}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (!showRes.ok) {
              console.warn(`⚠️ Show ${ticket.show} not found (${showRes.status})`);
              return { ...ticket, showDetail: null };
            }

            const showDetail = await showRes.json();
            return { ...ticket, showDetail };
          } catch (err) {
            console.error(`❌ Error fetching show ${ticket.show}:`, err);
            return { ...ticket, showDetail: null };
          }
        })
      );

      setBookings(detailedShows);
      console.log("✅ Final bookings data:", detailedShows);
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      message.error("Failed to load bookings ❌");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [userId]);

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
            const showDetail = booking.showDetail;

            if (!showDetail) {
              return (
                <Card
                  key={idx}
                  title="Show Unavailable"
                  bordered
                  className="w-full shadow-md rounded bg-red-50 border border-red-200"
                >
                  <p className="text-red-500 text-sm">
                    This show has been removed or is no longer available.
                  </p>
                </Card>
              );
            }

            const theatre = showDetail.theatre || {};
            const movie = showDetail.movie || {};

            return (
              <Card
                key={idx}
                title={movie.title || "Unknown Movie"}
                bordered
                className="w-full shadow-md rounded"
              >
                <p>
                  <span className="font-medium text-gray-700">🎬 Theatre:</span>{" "}
                  {theatre.name} ({theatre.location})
                </p>
                <p>
                  <span className="font-medium text-gray-700">🕓 Time:</span>{" "}
                  {dayjs(showDetail.time).format("DD MMM YYYY, hh:mm A")}
                </p>
                <p>
                  <span className="font-medium text-gray-700"> Language:</span>{" "}
                  {showDetail.language}
                </p>
                <p>
                  <span className="font-medium text-gray-700">💰 Total:</span>{" "}
                  ₹{booking.totalPrice}
                </p>
                <p>
                  <span className="font-medium text-gray-700">💺 Seats:</span>{" "}
                  {Array.isArray(booking.seats)
                    ? booking.seats
                        .map((s) => s.seatNumber || "Unknown")
                        .join(", ")
                    : "N/A"}
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
