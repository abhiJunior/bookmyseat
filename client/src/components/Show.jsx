import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button, Card, Divider, Tag, message } from "antd";

function Show() {
  const url = "http://localhost:5000"
  const navigate = useNavigate()
  const user = useSelector((state) => state.users.user);
  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const { showId } = useParams();
  const [messageApi, contextHolder] = message.useMessage();

  const fetchShow = async () => {
    try {
      const response = await fetch(`${url}/api/show/${showId}`, {
        method: "GET",
        credentials: "include",
      });
      const res = await response.json();
      setShow(res);
    } catch (err) {
      console.log(err.message)
      messageApi.error("Failed to fetch show ❌");
    }
  };

  useEffect(() => {
    fetchShow();
  }, []);

  const handlePayment = async () => {
    try {
      const response = await fetch(`${url}/api/payment/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: totalPrice * 100 }),
      });

      const order = await response.json();

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

          messageApi.success("Payment Successful Seats booked!");
          navigate("/booking")

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

  const totalPrice = selectedSeats.reduce((acc, seat) => acc + seat.price, 0);

  return (
    <>
      {contextHolder}
      <div className="flex flex-col items-center">
        <h3 className="mb-4 font-bold">🎬 Screen this side</h3>

        {show?.seats?.map((item, idx) => (
          <Card
            key={idx}
            title={`Rs ${item.price} - ${item.category}`}
            bordered
            className="w-full max-w-2xl mb-6"
          >
            {item.arrangements.map((row, rIdx) => (
              <div key={rIdx} className="flex gap-3 mt-2 justify-center">
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
                    >
                      {seat.seatNumber}
                    </Button>
                  );
                })}
              </div>
            ))}
          </Card>
        ))}

        {selectedSeats.length > 0 && (
          <Card className="w-full max-w-md text-center mt-6" bordered>
            <h3 className="font-bold text-lg">Selected Seats</h3>
            <Divider />
            <p>
              {selectedSeats.map((s) => (
                <Tag color="blue" key={s.seatNumber}>
                  {s.seatNumber}
                </Tag>
              ))}
            </p>
            <p className="font-medium mt-2">Total: Rs {totalPrice}</p>

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
