import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createProject, getProjects } from "../api/projects";
import ProjectCard from "../components/ProjectCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../hooks/useAuth";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const schema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
});

const Projects = () => {
  const { isAdmin } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const loadProjects = async () => {
    setLoading(true);
    try {
      const { data } = await getProjects();
      setProjects(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  const onSubmit = async (values) => {
    try {
      await createProject(values);
      toast.success("Project created");
      reset();
      loadProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to create project");
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
      {isAdmin && (
        <div className="card p-6">
          <h2 className="text-lg font-semibold text-slate-900">Create project</h2>
          <form className="mt-4 grid gap-4 md:grid-cols-3" onSubmit={handleSubmit(onSubmit)}>
            <div className="md:col-span-1">
              <label className="label">Title</label>
              <input className="input" {...register("title")} />
              {errors.title && <p className="mt-1 text-xs text-danger">{errors.title.message}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="label">Description</label>
              <input className="input" {...register("description")} />
            </div>
            <div className="md:col-span-3">
              <button type="submit" className="btn-primary" disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create project"}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : projects.length === 0 ? (
        <EmptyState title="No projects yet" description="Create a project to start tracking tasks." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Projects;
