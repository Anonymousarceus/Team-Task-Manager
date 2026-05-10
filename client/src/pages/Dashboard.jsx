import { useEffect, useMemo, useState } from "react";
import { getTasks } from "../api/tasks";
import StatCard from "../components/StatCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { formatDate, isOverdue } from "../utils/format";
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from "recharts";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const statusColors = {
  todo: "#94a3b8",
  "in-progress": "#3b82f6",
  completed: "#22c55e",
};

const Dashboard = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const { data } = await getTasks();
        setTasks(data);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => task.status === "completed").length;
    const pending = tasks.filter((task) => task.status !== "completed").length;
    const overdue = tasks.filter((task) => isOverdue(task)).length;
    return { total, completed, pending, overdue };
  }, [tasks]);

  const chartData = useMemo(() => {
    return [
      { name: "Todo", value: tasks.filter((t) => t.status === "todo").length, key: "todo" },
      {
        name: "In Progress",
        value: tasks.filter((t) => t.status === "in-progress").length,
        key: "in-progress",
      },
      {
        name: "Completed",
        value: tasks.filter((t) => t.status === "completed").length,
        key: "completed",
      },
    ];
  }, [tasks]);

  const recent = [...tasks]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const assigned = tasks.filter((task) => task.assignedTo?._id === user?.id || task.assignedTo?._id === user?._id);

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total tasks" value={stats.total} />
        <StatCard title="Completed" value={stats.completed} />
        <StatCard title="Pending" value={stats.pending} />
        <StatCard title="Overdue" value={stats.overdue} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="text-lg font-semibold text-slate-900">Tasks by status</h2>
          <div className="mt-4 h-64">
            {loading ? (
              <LoadingSkeleton rows={6} />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={chartData} dataKey="value" nameKey="name" outerRadius={90} label>
                    {chartData.map((entry) => (
                      <Cell key={entry.key} fill={statusColors[entry.key]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Recent activity</h2>
          <div className="mt-4 space-y-4">
            {loading ? (
              <LoadingSkeleton rows={4} />
            ) : recent.length === 0 ? (
              <p className="text-sm text-slate-500">No recent activity</p>
            ) : (
              recent.map((task) => (
                <div key={task._id} className="flex items-start justify-between text-sm">
                  <div>
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500">
                      {task.projectId?.title || "General"} • {formatDate(task.updatedAt)}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">{task.status}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="card p-6">
        <h2 className="text-lg font-semibold text-slate-900">Assigned tasks</h2>
        <div className="mt-4">
          {loading ? (
            <LoadingSkeleton rows={4} />
          ) : assigned.length === 0 ? (
            <EmptyState title="No assignments yet" description="Tasks assigned to you will appear here." />
          ) : (
            <div className="space-y-3">
              {assigned.slice(0, 5).map((task) => (
                <div
                  key={task._id}
                  className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3"
                >
                  <div>
                    <p className="font-medium text-slate-900">{task.title}</p>
                    <p className="text-xs text-slate-500">
                      {task.projectId?.title || "General"} • Due {formatDate(task.dueDate)}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400">{task.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
