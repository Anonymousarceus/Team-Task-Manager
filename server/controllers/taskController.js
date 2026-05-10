const Task = require("../models/Task");
const Project = require("../models/Project");

const getTasks = async (req, res) => {
  const { status, priority, projectId, search, sortBy } = req.query;
  const query = {};

  if (req.user.role !== "admin") {
    query.assignedTo = req.user._id;
  }

  if (status) query.status = status;
  if (priority) query.priority = priority;
  if (projectId) query.projectId = projectId;
  if (search) {
    query.$or = [
      { title: { $regex: search, $options: "i" } },
      { description: { $regex: search, $options: "i" } },
    ];
  }

  let sort = { createdAt: -1 };
  if (sortBy === "dueDate") {
    sort = { dueDate: 1 };
  }

  const tasks = await Task.find(query)
    .populate("assignedTo", "name email")
    .populate("projectId", "title")
    .sort(sort);

  if (sortBy === "priority") {
    const order = { low: 1, medium: 2, high: 3 };
    tasks.sort((a, b) => order[b.priority] - order[a.priority]);
  }

  return res.json(tasks);
};

const createTask = async (req, res) => {
  const { title, description, priority, status, dueDate, assignedTo, projectId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  if (assignedTo && !project.members.map(String).includes(assignedTo)) {
    return res.status(400).json({ message: "Assignee must be a project member" });
  }

  const task = await Task.create({
    title,
    description,
    priority,
    status,
    dueDate,
    assignedTo,
    projectId,
    createdBy: req.user._id,
  });

  return res.status(201).json(task);
};

const updateTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  const isOwner = task.assignedTo && task.assignedTo.toString() === req.user._id.toString();
  if (req.user.role !== "admin" && !isOwner) {
    return res.status(403).json({ message: "Access denied" });
  }

  if (req.user.role !== "admin") {
    const { status } = req.body;
    task.status = status ?? task.status;
  } else {
    const { title, description, priority, status, dueDate, assignedTo } = req.body;
    if (assignedTo) {
      const project = await Project.findById(task.projectId);
      if (project && !project.members.map(String).includes(String(assignedTo))) {
        return res.status(400).json({ message: "Assignee must be a project member" });
      }
    }
    task.title = title ?? task.title;
    task.description = description ?? task.description;
    task.priority = priority ?? task.priority;
    task.status = status ?? task.status;
    task.dueDate = dueDate ?? task.dueDate;
    task.assignedTo = assignedTo ?? task.assignedTo;
  }

  await task.save();
  const populated = await task.populate("assignedTo", "name email");
  return res.json(populated);
};

const deleteTask = async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  await task.deleteOne();
  return res.json({ message: "Task deleted" });
};

module.exports = { getTasks, createTask, updateTask, deleteTask };
