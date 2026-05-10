import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-semibold text-slate-900">404</h1>
      <p className="mt-2 text-sm text-slate-500">Page not found.</p>
      <Link to="/" className="btn-primary mt-4">
        Back to dashboard
      </Link>
    </div>
  );
};

export default NotFound;
