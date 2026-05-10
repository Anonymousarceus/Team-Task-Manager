import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  deleteProject,
  getProjectById,
  updateProject,
  updateProjectMembers,
} from "../api/projects";
import { getTasks, updateTask, deleteTask } from "../api/tasks";
import { getUsers } from "../api/users";
import LoadingSkeleton from "../components/LoadingSkeleton";
import TaskTable from "../components/TaskTable";
import Badge from "../components/Badge";
import toast from "react-hot-toast";
import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  status: z.enum(["active", "archived"]),
});

const ProjectDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(true);
  const [project, setProject] = useState(null);
  const [progress, setProgress] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedMembers, setSelectedMembers] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const loadData = async () => {
    setLoading(true);
    try {
      const [{ data: projectData }, { data: tasksData }] = await Promise.all([
        getProjectById(id),
        getTasks({ projectId: id }),
      ]);
      setProject(projectData.project);
      setProgress(projectData.progress);
      setTasks(tasksData);
      setSelectedMembers(projectData.project.members.map((member) => member._id));
      reset({
        title: projectData.project.title,
        description: projectData.project.description,
        status: projectData.project.status,
      });

      if (isAdmin) {
        const { data: usersData } = await getUsers();
        setUsers(usersData);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const onUpdateProject = async (values) => {
    try {
      await updateProject(id, values);
      toast.success("Project updated");
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const onUpdateMembers = async () => {
    try {
      await updateProjectMembers(id, { members: selectedMembers });
      toast.success("Members updated");
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update members");
    }
  };

  const onDeleteProject = async () => {
    if (!window.confirm("Delete this project and all tasks?")) return;
    try {
      await deleteProject(id);
      toast.success("Project deleted");
      navigate("/projects");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete project");
    }
  };

  const onStatusChange = async (task, status) => {
    try {
      await updateTask(task._id, { status });
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Update failed");
    }
  };

  const onDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(taskId);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return <LoadingSkeleton rows={8} />;
  }

  if (!project) {
    return <p className="text-sm text-slate-500">Project not found.</p>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="card p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">{project.title}</h2>
            <p className="text-sm text-slate-500">{project.description || "No description"}</p>
          </div>
          <Badge tone={project.status === "active" ? "info" : "warning"}>{project.status}</Badge>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
            <div
              className="h-2 rounded-full bg-primary-600"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-900">Team members</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {project.members.map((member) => (
            <span
              key={member._id}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-700"
            >
              {member.name} ({member.role})
            </span>
          ))}
        </div>
      </div>

      {isAdmin && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900">Edit project</h3>
          <form className="mt-4 grid gap-4 md:grid-cols-3" onSubmit={handleSubmit(onUpdateProject)}>
            <div>
              <label className="label">Title</label>
              <input className="input" {...register("title")} />
              {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" {...register("status")}>
                <option value="active">Active</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div className="md:col-span-3">
              <label className="label">Description</label>
              <input className="input" {...register("description")} />
            </div>
            <div className="md:col-span-3 flex gap-3">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </button>
              <button type="button" className="btn-danger" onClick={onDeleteProject}>
                Delete project
              </button>
            </div>
          </form>
        </div>
      )}

      {isAdmin && (
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-slate-900">Members</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {users.map((user) => (
              <label key={user._id} className="flex items-center gap-3 text-sm text-slate-700">
                <input
                  type="checkbox"
                  className="h-4 w-4"
                  checked={selectedMembers.includes(user._id)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setSelectedMembers((prev) => [...prev, user._id]);
                    } else {
                      setSelectedMembers((prev) => prev.filter((id) => id !== user._id));
                    }
                  }}
                />
                <span>{user.name} ({user.role})</span>
              </label>
            ))}
          </div>
          <button type="button" className="btn-primary mt-4" onClick={onUpdateMembers}>
            Update members
          </button>
        </div>
      )}

      <div className="card p-6">
        <h3 className="text-lg font-semibold text-slate-900">Tasks</h3>
        <div className="mt-4">
          {tasks.length === 0 ? (
            <p className="text-sm text-slate-500">No tasks for this project.</p>
          ) : (
            <TaskTable
              tasks={tasks}
              onStatusChange={onStatusChange}
              onDelete={onDeleteTask}
              canEdit={isAdmin}
            />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectDetails;
