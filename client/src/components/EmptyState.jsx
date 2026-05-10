const EmptyState = ({ title, description, action }) => {
  return (
    <div className="card flex flex-col items-center justify-center gap-2 p-10 text-center">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="text-sm text-slate-500">{description}</p>
      {action}
    </div>
  );
};

export default EmptyState;
