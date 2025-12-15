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
    }
}

module.exports = roomController;