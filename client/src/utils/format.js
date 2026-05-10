export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
};

export const getPriorityTone = (priority) => {
  if (priority === "high") return "danger";
  if (priority === "medium") return "warning";
  return "success";
};

export const getStatusTone = (status) => {
  if (status === "completed") return "success";
  if (status === "in-progress") return "info";
  return "default";
};

export const isOverdue = (task) => {
  if (!task?.dueDate) return false;
  if (task.status === "completed") return false;
  return new Date(task.dueDate) < new Date();
};
