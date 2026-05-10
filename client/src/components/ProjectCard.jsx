import { Link } from "react-router-dom";
import Badge from "./Badge";

const ProjectCard = ({ project }) => {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{project.title}</h3>
          <p className="mt-2 text-sm text-slate-500">{project.description || "No description"}</p>
        </div>
        <Badge tone={project.status === "active" ? "info" : "warning"}>{project.status}</Badge>
      </div>
      <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
        <span>{project.members?.length || 0} members</span>
        <Link to={`/projects/${project._id}`} className="text-primary-600 hover:underline">
          View details
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
