const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        uppercase: true // to handle case-insensitive
    },
    capacity: {
        type: Number,
        required: true,
        validate: [
            {
                validator: Number.isInteger,
                message: "Capacity must be an integer"
            },
            {
                validator: v => v >= 1,
                message: "Capacity must be positive (>=1)"
            }
        ]
    },
    floor: {
        type: Number,
        required: true,
        validate: {
            validator: Number.isInteger,
            message: "Floor value must be an integer"
        }
    },
    amenities: {
        type: [String]
    },
    timeZone: {
        type: String,
        default: "Asia/Kolkata" // to ensure bookings are in room's local time
    }
}, { timestamps: true })

// ensures unique index for name in MongoDB
roomSchema.index({ name: 1 }, { unique: true })

module.exports = mongoose.model("Room", roomSchema, "rooms");