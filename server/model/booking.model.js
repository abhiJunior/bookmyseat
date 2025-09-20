import { Schema, model } from "mongoose";

const bookingSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    show: {
      type: Schema.Types.ObjectId,
      ref: "show",
      required: true,
    },
    seats: [
      {
        seatNumber: String,
        category: String,
        price: Number,
      },
    ],
    totalPrice: {
      type: Number,
      required: true,
    },
    transaction_id: {
      type: String,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Success", "Failed"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

const Booking = model("booking", bookingSchema);

export default Booking;
