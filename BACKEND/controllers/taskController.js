const Task = require("../models/task.js");

// Create a new task
module.exports.createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;

  try {
    const newTask = new Task({
      title,
      description,
      assignedTo,
      createdBy: req.user.id 
    });

    const result = await newTask.save();
    res.status(201).send({ msg: "Task created", task: newTask });
  } catch (err) {
    res.status(500).json({ msg: "Server error" ,error:err});
  }
};


module.exports.getTasks = async (req, res) => {
  const { status, assignedTo } = req.query;
  let filter = {};

  if (status) filter.status = status;
  if (assignedTo) filter.assignedTo = assignedTo;

  try {
    const tasks = await Task.find(filter).populate('createdBy').sort({ createdAt: -1 });
    res.send({tasks : tasks,msg:"Tasks found successfully!!"});
  } catch (err) {
    res.status(500).send({ msg: "Server error" });
  }
};

// Update task status
module.exports.updateTaskStatus =  async (req, res) => {
  const { status } = req.body;
  const { id } = req.params;

  if (!status) {
    return res.status(400).json({ error: "Status is required" });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    console.log("Upadate",updatedTask)
    res.json({ msg: "Task updated", task: updatedTask });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
};



module.exports.deleteTask = async (req, res) => {
  const { id } = req.params;

  try {
    const task = await Task.findByIdAndDelete(id);
    if (!task) return res.status(404).send({ message: "Task not found" });

    res.send({ message: "Task deleted" });
  } catch (err) {
    res.status(500).send({ msg: "Server error" });
  }
};
