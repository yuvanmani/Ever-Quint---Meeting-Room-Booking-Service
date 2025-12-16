const express = require("express");
const { createBooking } = require("../controllers/bookingController");

const bookingRouter = express.Router();

bookingRouter.post("", createBooking);

module.exports = bookingRouter;