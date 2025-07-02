const mongoose = require("mongoose");
const Schema = mongoose.Schema();

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },

  description: {
    type: String,
    required: true
  },

  assignedTo: {
    type: String, 
    required: true
  },

  status: {
    type: String,
    enum: ["To Do", "In Progress", "Done"],
    default: "To Do"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Task", taskSchema);
