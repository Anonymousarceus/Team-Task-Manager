import Badge from "./Badge";
import { formatDate, getPriorityTone, isOverdue } from "../utils/format";

const TaskTable = ({ tasks, onStatusChange, onDelete, canEdit }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="border-b border-slate-200 text-xs uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Task</th>
            <th className="px-4 py-3">Project</th>
            <th className="px-4 py-3">Priority</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Due</th>
            <th className="px-4 py-3">Assignee</th>
            {canEdit && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-b border-slate-100">
              <td className="px-4 py-3">
                <div className="font-medium text-slate-900">{task.title}</div>
                <div className="text-xs text-slate-500">{task.description || "No description"}</div>
              </td>
              <td className="px-4 py-3 text-slate-600">{task.projectId?.title || "—"}</td>
              <td className="px-4 py-3">
                <Badge tone={getPriorityTone(task.priority)}>{task.priority}</Badge>
              </td>
              <td className="px-4 py-3">
                <select
                  className="rounded-md border border-slate-200 px-2 py-1 text-xs"
                  value={task.status}
                  onChange={(event) => onStatusChange(task, event.target.value)}
                >
                  <option value="todo">Todo</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </td>
              <td className="px-4 py-3 text-slate-600">
                <span className={isOverdue(task) ? "text-danger font-medium" : ""}>
                  {formatDate(task.dueDate)}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-600">{task.assignedTo?.name || "Unassigned"}</td>
              {canEdit && (
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    className="btn-danger text-xs"
                    onClick={() => onDelete(task._id)}
                  >
                    Delete
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
