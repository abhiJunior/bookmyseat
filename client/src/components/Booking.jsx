import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Card, List, Spin, message } from "antd";
import dayjs from "dayjs";

function Booking() {
  const url = "http://localhost:5000"
  const user = useSelector((state) => state.users.user);
  const userId = user._id;


  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    try {
      setLoading(true);

      // 1. Get all bookings for this user
      const response = await fetch(
        `${url}/api/booking/ticket/${userId}`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      const tickets = await response.json();

      // 2. For each booking, fetch show details
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
    <div style={{ padding: "20px" }}>
      <h2 style={{ fontWeight: "bold", marginBottom: "20px" }}>
        🎟️ Your Booked Tickets
      </h2>

      {loading ? (
        <Spin size="large" />
      ) : bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <List
          grid={{ gutter: 16, column: 2 }}
          dataSource={bookings}
          renderItem={(booking) => {
            const { showDetail } = booking;
            return (
              <List.Item>
                <Card
                  title={showDetail.movie?.title || "Unknown Movie"}
                  bordered
                >
                  <p>
                    <strong>Theatre:</strong> {showDetail.theatre?.name} (
                    {showDetail.theatre?.location})
                  </p>
                  <p>
                    <strong>Time:</strong>{" "}
                    {dayjs(showDetail.time).format("DD MMM YYYY, hh:mm A")}
                  </p>
                  <p>
                    <strong>Language:</strong> {showDetail.language}
                  </p>
                  <p>
                    <strong>Total Price:</strong> Rs {booking.totalPrice}
                  </p>
                  <p>
                    <strong>Seats:</strong>{" "}
                    {booking.seats.map((s) => s.seatNumber).join(", ")}
                  </p>
                </Card>
              </List.Item>
            );
          }}
        />
      )}
    </div>
  );
}

export default Booking;
