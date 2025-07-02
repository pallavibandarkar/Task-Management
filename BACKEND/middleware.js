const jwt = require("jsonwebtoken");
const Task = require('./models/task.js')
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next(); 
  } catch (err) {
    res.status(401).send({ msg: "Invalid or expired token" });
  }
};

const canUpdateStatus = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.assignedTo !== req.user.username) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this task" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const canDeleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('createdBy');
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.createdBy?.username !== req.user.username) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this task" });
    }

    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = {
  verifyToken,
  canDeleteTask,
  canUpdateStatus,
}
