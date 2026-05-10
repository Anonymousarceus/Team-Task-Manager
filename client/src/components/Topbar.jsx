import { useAuth } from "../hooks/useAuth";

const Topbar = () => {
  const { user, logout } = useAuth();

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
      <div>
        <p className="text-xs text-slate-500">Welcome back</p>
        <h1 className="text-lg font-semibold text-slate-900">{user?.name || "User"}</h1>
      </div>
      <div className="flex items-center gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          {user?.role || "member"}
        </span>
        <button type="button" className="btn-secondary" onClick={logout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Topbar;
