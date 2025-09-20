import Razorpay from "razorpay";
import crypto from "crypto";
import Booking from "../model/booking.model.js";
import Show from "../model/show.model.js";

// 🔑 Initialize Razorpay
// console.log("RAZORPAY_KEY_ID:", process.env.RAZORPAY_KEY_ID);
// console.log("RAZORPAY_KEY_SECRET:", process.env.RAZORPAY_KEY_SECRET);
const razorpay = new Razorpay({
  key_id: "rzp_test_RIGV80BFMlCwSf", // match .env variable
  key_secret: "L0uD8UV38nDqQ9qWp75uQ8JU", // must match .env
});

// ✅ Step 1: Create order
export const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    const options = {
      amount: amount, // in paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    res.status(200).json(order);
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({ error: "Failed to create order" });
  }
};

// ✅ Step 2: Verify payment + create booking
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      seats,
      showId,
      totalPrice,
      userId,
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET) // use correct var
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature !== expectedSign) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid signature" });
    }

    // ✅ Save booking
  

    const booking = await Booking.create({
      user: userId,
      show: showId,
      seats,
      totalPrice,
      transaction_id: razorpay_payment_id,
      paymentStatus: "Success",
    });

    // ✅ Mark selected seats as booked
    for (const seat of seats) {
      await Show.updateOne(
        { _id: showId },
        {
          $set: {
            "seats.$[cat].arrangements.$[].$[seat].status": "Booked",
          },
        },
        {
          arrayFilters: [
            { "cat.category": seat.category },
            { "seat.seatNumber": seat.seatNumber },
          ],
        }
      );
    }

    res.status(200).json({ success: true, booking });
  } catch (err) {
    console.error("Error verifying Razorpay payment:", err);
    res.status(500).json({ error: "Payment verification failed" });
  }
};
