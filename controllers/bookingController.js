const Booking = require("../models/booking");
const Room = require("../models/room");

const bookingController = {
    createBooking: async (req, res) => {
        try {
            // get the details from the request body
            const { roomId, title, organizerEmail, startTime, endTime } = req.body;

            // convert the date string to Date object
            const start = new Date(startTime);
            const end = new Date(endTime);

            // check start  date >= current date
            const currentDate = new Date();

            if (start < currentDate) {
                return res.status(400).json({ message: "Start date must be equal or after current date." });
            }

            // check startTime < endTime
            if (start >= end) {
                return res.status(400).json({ message: "Start time must be before end time." })
            }

            // check duration must be between 15 minutes and 4 hours
            const durationInMs = end - start;

            if (durationInMs < 900000 || durationInMs > 14400000) {
                return res.status(400).json({ message: "Duration must be between 15 minutes and 4 hours." })
            }

            // set time zone for room to find overlapping
            const roomTimezone = "Asia/Kolkata";

            // create a variable to convert date objects into parts based on time zone
            const formatter = new Intl.DateTimeFormat("en-US", {
                timeZone: roomTimezone,
                weekday: "short",
                hour: "numeric",
                minute: "numeric",
                hour12: false
            });

            // separate the date object into day(Mon,Tue,Wed), hour, minute
            const getParts = (date) => {

                // convert the date into parts
                const parts = formatter.formatToParts(date);

                let weekday;
                let hour;
                let minute;

                // assign the parts into day, hour, minute
                for (const part of parts) {
                    if (part.type === "weekday") {
                        weekday = part.value
                    };
                    if (part.type === "hour") {
                        hour = Number(part.value)
                    };
                    if (part.type === "minute") {
                        minute = Number(part.value)
                    };
                }
                return { weekday, hour, minute };
            }

            // get the day, hour, minute from the start and end date objects
            const startParts = getParts(start);
            const endParts = getParts(end);

            // bookings allowed days
            const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri"];

            // check start and end in same day & booking is in allowed weekday
            if (startParts.weekday !== endParts.weekday || !weekDays.includes(startParts.weekday)) {
                return res.status(400).json({ message: "Bookings are allowed only Mon-Fri." })
            }

            // working hours in minutes(given in question statement)
            const workStart = 8 * 60;
            const workEnd = 20 * 60;

            // start and end time in minutes from 00:00(12 AM)
            const startMinutes = startParts.hour * 60 + startParts.minute;
            const endMinutes = endParts.hour * 60 + endParts.minute;

            // check if booking is between 08:00 - 20:00
            if (startMinutes < workStart || endMinutes > workEnd || startMinutes >= endMinutes) {
                return res.status(400).json({ message: "Bookings are allowed only between 08:00 and 20:00 (IST)." })
            }

            // check if the room exists
            const room = await Room.findById(roomId).select("-__v");

            if (!room) {
                return res.status(404).json({ message: "Room not found." });
            }

            // check if there is any booking already in the given start and end time
            const overLapBooking = await Booking.find({ roomId: roomId, startTime: { $lt: endTime }, endTime: { $gt: startTime } }).select("-__v");

            if (overLapBooking.length > 0) {
                return res.status(409).json({ message: "This room is already booked for the selected time slot." })
            }

            // create new booking as per the given body in the statement
            const newBooking = new Booking({
                roomId, title, organizerEmail, startTime, endTime
            });

            // save booking to the database
            await newBooking.save();

            // send response to the user
            res.status(201).json({ message: "Booking Status : Confirmed" });

        }
        catch (error) {
            res.status(400).json({ message: error.message });
        }
    },
    getBookings: async (req, res) => {
        try {
            // get the details from the request query
            const { roomId, from, to, limit, offset } = req.query;

            // if no filters given send all bookings with limit & offset
            if (!roomId && !from && !to) {
                const bookings = await Booking.find().select("-__v").limit(Number(limit)).skip(Number(offset));

                if (bookings.length <= 0) {
                    return res.status(200).json({ message: "No bookings found" });
                }

                // response as per question statement     
                const totalDocuments = await Booking.countDocuments();

                const finalResponse = {
                    items: bookings,
                    total: Number(totalDocuments),
                    limit: Number(limit),
                    offset: Number(offset)
                }

                return res.status(200).json(finalResponse);
            }

            // if roomId, from, to are given
            if (roomId && from && to) {
                const bookings = await Booking.find({ roomId: roomId, startTime: { $lt: to }, endTime: { $gt: from } }).select("-__v").limit(Number(limit)).skip(Number(offset));

                if (bookings.length <= 0) {
                    return res.status(200).json({ message: "No bookings found" });
                }

                // response as per question statement
                const totalDocuments = await Booking.countDocuments({ roomId: roomId, startTime: { $lt: to }, endTime: { $gt: from } });

                const finalResponse = {
                    items: bookings,
                    total: Number(totalDocuments),
                    limit: Number(limit),
                    offset: Number(offset)
                }

                return res.status(200).json(finalResponse);
            }

            // if roomId & from only given
            else if (roomId && from) {
                const bookings = await Booking.find({ roomId: roomId, endTime: { $gt: from } }).select("-__v").limit(Number(limit)).skip(Number(offset));

                if (bookings.length <= 0) {
                    return res.status(200).json({ message: "No bookings found" });
                }

                // response as per question statement

                const totalDocuments = await Booking.countDocuments({ roomId: roomId, endTime: { $gt: from } });

                const finalResponse = {
                    items: bookings,
                    total: Number(totalDocuments),
                    limit: Number(limit),
                    offset: Number(offset)
                }

                return res.status(200).json(finalResponse);
            }

            // if roomId & to only given
            else if (roomId && to) {
                const bookings = await Booking.find({ roomId: roomId, startTime: { $lt: to } }).select("-__v").limit(Number(limit)).skip(Number(offset));

                if (bookings.length <= 0) {
                    return res.status(200).json({ message: "No bookings found" });
                }

                // response as per question statement

                const totalDocuments = await Booking.countDocuments({ roomId: roomId, startTime: { $lt: to } });

                const finalResponse = {
                    items: bookings,
                    total: Number(totalDocuments),
                    limit: Number(limit),
                    offset: Number(offset)
                }

                return res.status(200).json(finalResponse);
            }

            // if from & to only given
            else if (from && to) {
                const bookings = await Booking.find({ startTime: { $lt: to }, endTime: { $gt: from } }).select("-__v").limit(Number(limit)).skip(Number(offset));

                if (bookings.length <= 0) {
                    return res.status(200).json({ message: "No bookings found" });
                }

                // response as per question statement

                const totalDocuments = await Booking.countDocuments({ startTime: { $lt: to }, endTime: { $gt: from } });

                const finalResponse = {
                    items: bookings,
                    total: Number(totalDocuments),
                    limit: Number(limit),
                    offset: Number(offset)
                }

                return res.status(200).json(finalResponse);
            }

            // if roomId only given
            else if (roomId) {
                const bookings = await Booking.find({ roomId: roomId }).select("-__v").limit(Number(limit)).skip(Number(offset));

                if (bookings.length <= 0) {
                    return res.status(200).json({ message: "No bookings found" });
                }

                // response as per question statement

                const totalDocuments = await Booking.countDocuments({ roomId: roomId });

                const finalResponse = {
                    items: bookings,
                    total: Number(totalDocuments),
                    limit: Number(limit),
                    offset: Number(offset)
                }

                return res.status(200).json(finalResponse);
            }

            // if from only given
            else if (from) {
                const bookings = await Booking.find({ endTime: { $gt: from } }).select("-__v").limit(Number(limit)).skip(Number(offset));

                if (bookings.length <= 0) {
                    return res.status(200).json({ message: "No bookings found" });
                }

                // response as per question statement

                const totalDocuments = await Booking.countDocuments({ endTime: { $gt: from } });

                const finalResponse = {
                    items: bookings,
                    total: Number(totalDocuments),
                    limit: Number(limit),
                    offset: Number(offset)
                }

                return res.status(200).json(finalResponse);
            }

            // if to only given
            else if (to) {
                const bookings = await Booking.find({ startTime: { $lt: to } }).select("-__v").limit(Number(limit)).skip(Number(offset));

                if (bookings.length <= 0) {
                    return res.status(200).json({ message: "No bookings found" });
                }

                // response as per question statement

                const totalDocuments = await Booking.countDocuments({ startTime: { $lt: to } });

                const finalResponse = {
                    items: bookings,
                    total: Number(totalDocuments),
                    limit: Number(limit),
                    offset: Number(offset)
                }

                return res.status(200).json(finalResponse);
            }

        } catch (error) {
            res.status(400).json({ message: error.message });
        }
    }
}

module.exports = bookingController;