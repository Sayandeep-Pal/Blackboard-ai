const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema({
  username: String,
  email: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const People = mongoose.model("Blackboard", peopleSchema);

module.exports = People;
