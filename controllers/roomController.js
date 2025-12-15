const Room = require("../models/room");

const roomController = {
    createRoom: async (req, res) => {
        try {
            // get the details from the request body
            const { name, capacity, floor, amenities } = req.body;

            // create new room
            const newRoom = new Room({
                name, capacity, floor, amenities
            })

            // save newRoom in database
            await newRoom.save();

            // send response to user
            res.status(201).json(newRoom);
        }
        catch (error) {

            // check if the error is validation error
            if (error.name === "ValidationError") {

                const errorType = error.name;

                // collect the error messages in an array from error object
                const messages = Object.values(error.errors).map(err => err.message);

                const returnError = { errorType, messages }

                // send the errors to the user
                return res.status(400).json(returnError)
            }

            // check if the error occured due to "unique" property in schema
            if (error.code === 11000) {

                const errorType = "Duplicate key error";
                const message = "Room name must be unique";

                const returnError = { errorType, message };
                return res.status(400).json(returnError);
            }

            return res.status(500).json({ errors: "Internal server error" });
        }
    },
    getRooms: async (req, res) => {
        try {
            const minCapacity = Number(req.query.minCapacity);
            const amenities = req.query.amenity;

            // if no filters are given, return all rooms
            if (!minCapacity && !amenities) {
                const rooms = await Room.find().select("-__v");

                if (rooms.length < 1) {
                    return res.status(400).json({ message: "No rooms found." })
                }

                res.status(200).json(rooms);
            }

            // check minCapacity exists & is an integer
            else if (minCapacity && !Number.isInteger(minCapacity)) {
                return res.status(400).json({ message: "minCapacity must be an integer" });
            }

            // if both filters are given
            else if (minCapacity && amenities) {
                const amenityQuery = amenities.split(",");
                const rooms = await Room.find({ capacity: { $gte: minCapacity }, amenities: { $in: amenityQuery } }).select("-__v");

                if (rooms.length < 1) {
                    return res.status(400).json({ message: "No rooms found." })
                }

                res.status(200).json(rooms)
            }

            // if minCapacity only given
            else if (minCapacity) {
                const rooms = await Room.find({ capacity: { $gte: minCapacity } }).select("-__v");

                if (rooms.length < 1) {
                    return res.status(400).json({ message: "No rooms found." })
                }

                res.status(200).json(rooms);
            }

            // if amenity only given
            else if (amenities) {
                const amenityQuery = amenities.split(",");

                const rooms = await Room.find({ amenities: { $in: amenityQuery } }).select("-__v");

                if (rooms.length < 1) {
                    return res.status(400).json({ message: "No rooms found." })
                }

                res.status(200).json(rooms);
            }

        }
        catch (error) {
            res.status(400).json({ message: "Retrieve rooms failed." });
        }
    }
}

module.exports = roomController;