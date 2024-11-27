const mongoose = require("mongoose");

const peopleSchema = new mongoose.Schema({
  Name: String,
  Email: String,
});

const People = mongoose.model("Blackboard", peopleSchema);

module.exports = People;
