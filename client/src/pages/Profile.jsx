import { useAuth } from "../hooks/useAuth";
import { motion } from "framer-motion";

const Profile = () => {
  const { user } = useAuth();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="card max-w-2xl p-6">
      <h2 className="text-lg font-semibold text-slate-900">Profile</h2>
      <div className="mt-6 space-y-3 text-sm text-slate-600">
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span>Name</span>
          <span className="font-medium text-slate-900">{user?.name}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span>Email</span>
          <span className="font-medium text-slate-900">{user?.email}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span>Role</span>
          <span className="font-medium text-slate-900">{user?.role}</span>
        </div>
        <div className="flex justify-between border-b border-slate-100 pb-2">
          <span>Member since</span>
          <span className="font-medium text-slate-900">
            {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;
