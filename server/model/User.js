import { Schema, model } from "mongoose";

const peopleSchema = new Schema({
  Name: String,
  Email: String,
});

const People = model("Blackboard", peopleSchema);

export default People;
