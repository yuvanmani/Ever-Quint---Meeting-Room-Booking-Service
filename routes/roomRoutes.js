const express = require("express");
const { createRoom, getRooms } = require("../controllers/roomController");

const roomRouter = express.Router();

roomRouter.post("", createRoom);
roomRouter.get("", getRooms);

module.exports = roomRouter;