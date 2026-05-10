import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createTask, getTasks, updateTask, deleteTask } from "../api/tasks";
import { getProjects } from "../api/projects";
import { getUsers } from "../api/users";
import TaskTable from "../components/TaskTable";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  priority: z.enum(["low", "medium", "high"]),
  status: z.enum(["todo", "in-progress", "completed"]),
  dueDate: z.string().optional(),
  projectId: z.string().min(1),
  assignedTo: z.string().optional(),
});

const Tasks = () => {
  const { isAdmin } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
    sortBy: "",
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { priority: "medium", status: "todo" },
  });
  const selectedProjectId = watch("projectId");

  const loadData = async () => {
    setLoading(true);
    try {
      const [tasksRes, projectsRes] = await Promise.all([
        getTasks({
          status: filters.status || undefined,
          priority: filters.priority || undefined,
          search: filters.search || undefined,
          sortBy: filters.sortBy || undefined,
        }),
        getProjects(),
      ]);
      setTasks(tasksRes.data);
      setProjects(projectsRes.data);

      if (isAdmin) {
        const { data } = await getUsers();
        setUsers(data);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [filters.status, filters.priority, filters.search, filters.sortBy]);

  const onSubmit = async (values) => {
    try {
      await createTask({
        ...values,
        dueDate: values.dueDate ? new Date(values.dueDate) : undefined,
        assignedTo: values.assignedTo || undefined,
      });
      toast.success("Task created");
      reset();
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create task");
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

  const onDelete = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await deleteTask(taskId);
      loadData();
    } catch (error) {
      toast.error(error.response?.data?.message || "Delete failed");
    }
  };

  const projectOptions = useMemo(
    () => projects.map((project) => ({ id: project._id, title: project.title })),
    [projects]
  );

  const assigneeOptions = useMemo(() => {
    if (!selectedProjectId) return users;
    const selected = projects.find((project) => project._id === selectedProjectId);
    if (!selected?.members) return users;
    return users.filter((user) => selected.members.some((member) => member._id === user._id));
  }, [selectedProjectId, projects, users]);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {isAdmin && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Create task</h2>
          <form className="mt-4 grid gap-4 md:grid-cols-3" onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label className="label">Title</label>
              <input className="input" {...register("title")} />
              {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
            </div>
            <div>
              <label className="label">Project</label>
              <select className="input" {...register("projectId")}>
                <option value="">Select project</option>
                {projectOptions.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.title}
                  </option>
                ))}
              </select>
              {errors.projectId && (
                <p className="mt-1 text-xs text-danger">{errors.projectId.message}</p>
              )}
            </div>
            <div>
              <label className="label">Assignee</label>
              <select className="input" {...register("assignedTo")}>
                <option value="">Unassigned</option>
                {assigneeOptions.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name} ({user.role})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Priority</label>
              <select className="input" {...register("priority")}>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="label">Status</label>
              <select className="input" {...register("status")}>
                <option value="todo">Todo</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="label">Due date</label>
              <input className="input" type="date" {...register("dueDate")} />
            </div>
            <div className="md:col-span-3">
              <label className="label">Description</label>
              <input className="input" {...register("description")} />
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create task"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Tasks</h2>
        <div className="mt-4 grid gap-3 md:grid-cols-4">
          <input
            className="input"
            placeholder="Search tasks"
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
          />
          <select
            className="input"
            value={filters.status}
            onChange={(event) => setFilters((prev) => ({ ...prev, status: event.target.value }))}
          >
            <option value="">All statuses</option>
            <option value="todo">Todo</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            className="input"
            value={filters.priority}
            onChange={(event) => setFilters((prev) => ({ ...prev, priority: event.target.value }))}
          >
            <option value="">All priorities</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
          <select
            className="input"
            value={filters.sortBy}
            onChange={(event) => setFilters((prev) => ({ ...prev, sortBy: event.target.value }))}
          >
            <option value="">Sort by</option>
            <option value="dueDate">Due date</option>
            <option value="priority">Priority</option>
          </select>
        </div>

        <div className="mt-6">
          {loading ? (
            <LoadingSkeleton rows={6} />
          ) : tasks.length === 0 ? (
            <EmptyState title="No tasks yet" description="Create or assign tasks to see them here." />
          ) : (
            <TaskTable tasks={tasks} onStatusChange={onStatusChange} onDelete={onDelete} canEdit={isAdmin} />
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Tasks;
