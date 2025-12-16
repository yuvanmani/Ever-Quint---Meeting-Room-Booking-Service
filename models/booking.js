const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true
    },
    title: {
        type: String
    },
    organizerEmail: {
        type: String
    },
    startTime: {
        type: String,
        required: true,
    },
    endTime: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model("Booking", bookingSchema, "bookings");