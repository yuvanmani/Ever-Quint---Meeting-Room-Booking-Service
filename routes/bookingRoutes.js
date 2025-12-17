const express = require("express");
const { createBooking, getBookings } = require("../controllers/bookingController");

const bookingRouter = express.Router();

bookingRouter.post("", createBooking);
bookingRouter.get("", getBookings);

module.exports = bookingRouter;