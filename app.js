const express = require("express");
const roomRouter = require("./routes/roomRoutes");
const logger = require("./utils/logger");
const errorRoute = require("./utils/errorRoute");
const bookingRouter = require("./routes/bookingRoutes");

const app = express();

// middleware to parse request body
app.use(express.json());

// middleware to log incoming requests
app.use(logger);

app.use("/rooms", roomRouter);
app.use("/bookings", bookingRouter);

// middleware to handle 404 errors
app.use(errorRoute);

module.exports = app;