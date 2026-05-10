import { NavLink } from "react-router-dom";
import clsx from "clsx";

const navItems = [
  { to: "/", label: "Dashboard" },
  { to: "/projects", label: "Projects" },
  { to: "/tasks", label: "Tasks" },
  { to: "/profile", label: "Profile" },
];

const Sidebar = () => {
  return (
    <aside className="hidden h-screen w-64 flex-col border-r border-slate-200 bg-white px-6 py-8 md:flex">
      <div className="text-xl font-semibold text-slate-900">Team Task Manager</div>
      <nav className="mt-10 flex flex-1 flex-col gap-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              clsx(
                "rounded-lg px-3 py-2 text-sm font-medium transition",
                isActive ? "bg-primary-50 text-primary-700" : "text-slate-600 hover:bg-slate-100"
              )
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="text-xs text-slate-400">© 2026 TeamFlow</div>
    </aside>
  );
};

export default Sidebar;
