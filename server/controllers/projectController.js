const Project = require("../models/Project");
const Task = require("../models/Task");

const getProjects = async (req, res) => {
  let query = {};
  if (req.user.role !== "admin") {
    query = { members: req.user._id };
  }

  const projects = await Project.find(query)
    .populate("createdBy", "name email")
    .populate("members", "name email role");

  return res.json(projects);
};

const createProject = async (req, res) => {
  const { title, description, members, status } = req.body;

  const uniqueMembers = Array.from(
    new Set([req.user._id.toString(), ...(members || [])].map(String))
  );

  const project = await Project.create({
    title,
    description,
    status: status || "active",
    createdBy: req.user._id,
    members: uniqueMembers,
  });

  return res.status(201).json(project);
};

const getProjectById = async (req, res) => {
  const project = await Project.findById(req.params.id)
    .populate("createdBy", "name email")
    .populate("members", "name email role");

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const isMember =
    req.user.role === "admin" ||
    project.members.some((member) => member._id.toString() === req.user._id.toString());

  if (!isMember) {
    return res.status(403).json({ message: "Access denied" });
  }

  const totalTasks = await Task.countDocuments({ projectId: project._id });
  const completedTasks = await Task.countDocuments({
    projectId: project._id,
    status: "completed",
  });
  const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  return res.json({ project, progress, totalTasks, completedTasks });
};

const updateProject = async (req, res) => {
  const { title, description, status } = req.body;
  const project = await Project.findById(req.params.id);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  project.title = title ?? project.title;
  project.description = description ?? project.description;
  project.status = status ?? project.status;

  await project.save();
  return res.json(project);
};

const deleteProject = async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  await Task.deleteMany({ projectId: project._id });
  await project.deleteOne();
  return res.json({ message: "Project deleted" });
};

const updateProjectMembers = async (req, res) => {
  const { members } = req.body;
  if (!Array.isArray(members)) {
    return res.status(400).json({ message: "Members list is required" });
  }

  const project = await Project.findById(req.params.id);
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const uniqueMembers = Array.from(
    new Set([project.createdBy.toString(), ...members.map(String)])
  );

  project.members = uniqueMembers;
  await project.save();

  const populated = await project.populate("members", "name email role");
  return res.json(populated);
};

module.exports = {
  getProjects,
  createProject,
  getProjectById,
  updateProject,
  deleteProject,
  updateProjectMembers,
};
