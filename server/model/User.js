const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema({
  username: String,
  email: String,
});

const People = mongoose.model("Blackboard", peopleSchema);

module.exports = People;
