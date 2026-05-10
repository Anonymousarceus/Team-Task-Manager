const StatCard = ({ title, value, subtitle }) => {
  return (
    <div className="card p-5">
      <p className="text-xs uppercase tracking-wide text-slate-500">{title}</p>
      <div className="mt-3 text-3xl font-semibold text-slate-900">{value}</div>
      {subtitle && <p className="mt-2 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
};

export default StatCard;
