const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController.js");
const {verifyToken,canUpdateStatus,canDeleteTask  }= require("../middleware.js");

router.post("/", verifyToken, taskController.createTask);            
router.get("/", verifyToken, taskController.getTasks);               
router.put("/:id", verifyToken,canUpdateStatus, taskController.updateTaskStatus);    
router.delete("/:id", verifyToken,canDeleteTask, taskController.deleteTask);   

module.exports = router;
