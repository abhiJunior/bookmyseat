import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Card, Divider, Tag, message } from "antd";

function Show() {
  const url = "https://bookmyseat-backend.onrender.com";
  const navigate = useNavigate();
  const user = useSelector((state) => state.users.user);
  const { showId } = useParams();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const fetchShow = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const response = await fetch(`${url}/api/show/${showId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // ✅ use Bearer token from localStorage
        },
        credentials: "include",
      });
      const res = await response.json();
      setShow(res);
    } catch (err) {
      console.error(err.message);
      messageApi.error("Failed to fetch show ❌");
    }
  };

  useEffect(() => {
    fetchShow();
  }, []);

  const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);

  const handlePayment = async () => {
    if (!user) {
      messageApi.warning("Please log in to continue");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${url}/api/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice * 100 }),
      });

      const order = await response.json();
      if (!order?.id) {
        messageApi.error("Failed to initiate payment ❌");
        return;
      }

      const options = {
        key: "rzp_test_RIGV80BFMlCwSf",
        amount: order.amount,
        currency: order.currency,
        name: "BookMySeat",
        description: "Movie Ticket Booking",
        order_id: order.id,
        handler: async function (response) {
          await fetch(`${url}/api/payment/verify`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              seats: selectedSeats,
              showId: showId,
              totalPrice: totalPrice,
              userId: user?._id,
            }),
          });

          messageApi.success("✅ Payment Successful! Seats booked");
          navigate("/booking");
        },
        prefill: {
          name: user.fullName,
          email: user.email,
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment Error:", err);
      messageApi.error("Payment failed ❌ Please try again.");
    }
  };

  const handleSeatClick = (seat, price, category) => {
    if (seat.status === "Booked") return;

    const alreadySelected = selectedSeats.find(
      (s) => s.seatNumber === seat.seatNumber && s.category === category
    );

    if (alreadySelected) {
      setSelectedSeats((prev) =>
        prev.filter(
          (s) => !(s.seatNumber === seat.seatNumber && s.category === category)
        )
      );
    } else {
      setSelectedSeats((prev) => [...prev, { ...seat, price, category }]);
    }
  };

  return (
    <>
      {contextHolder}
      <div className="flex flex-col items-center px-2 py-4 sm:px-4 sm:py-6">
        <h3 className="mb-4 font-bold text-lg text-gray-700">🎬 Screen this side</h3>

        {/* Seat categories */}
        {show?.seats?.map((item, idx) => (
          <Card
            key={idx}
            title={`Rs ${item.price} - ${item.category}`}
            bordered
            className="w-full max-w-xs sm:max-w-md md:max-w-lg lg:max-w-3xl mb-6 shadow-sm"
          >
            {item.arrangements.map((row, rIdx) => (
              <div
                key={rIdx}
                className="grid grid-cols-3 gap-2 sm:flex sm:gap-4 sm:justify-center mt-2"
              >
                {row.map((seat, sIdx) => {
                  const isSelected = selectedSeats.some(
                    (s) =>
                      s.seatNumber === seat.seatNumber &&
                      s.category === item.category
                  );
                  return (
                    <Button
                      key={sIdx}
                      size="small"
                      type={
                        seat.status === "Booked"
                          ? "default"
                          : isSelected
                          ? "primary"
                          : "dashed"
                      }
                      disabled={seat.status === "Booked"}
                      onClick={() =>
                        handleSeatClick(seat, item.price, item.category)
                      }
                      className={`min-w-[28px] sm:min-w-[40px] ${
                        seat.status === "Booked"
                          ? "bg-gray-200 text-gray-500"
                          : isSelected
                          ? "bg-blue-500 text-white"
                          : "bg-white"
                      }`}
                    >
                      {seat.seatNumber}
                    </Button>
                  );
                })}
              </div>
            ))}
          </Card>
        ))}

        {/* Selected seats summary */}
        {selectedSeats.length > 0 && (
          <Card className="w-full max-w-xs sm:max-w-md text-center mt-6 shadow-md" bordered>
            <h3 className="font-bold text-lg">Selected Seats</h3>
            <Divider />
            <div className="flex flex-wrap gap-2 justify-center">
              {selectedSeats.map((s) => (
                <Tag color="blue" key={`${s.category}-${s.seatNumber}`}>
                  {s.category}-{s.seatNumber}
                </Tag>
              ))}
            </div>
            <p className="font-medium mt-3">Total: Rs {totalPrice}</p>

            <Button
              type="primary"
              block
              size="large"
              onClick={handlePayment}
              className="mt-4"
            >
              Pay Now
            </Button>
          </Card>
        )}
      </div>
    </>
  );
}

export default Show;
