export default function TaskGrid({ tasks = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {tasks.map((task, i) => {
        const Icon = task.icon;
        return (
          <a
            key={i}
            href={task.href || "#"}
            className="bg-bg-card border border-border-subtle rounded-[20px] p-5 flex items-center gap-4 hover:-translate-y-1 hover:shadow-lux-hover transition-all duration-300 group"
          >
            <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
              {typeof task.icon === "function" ? <Icon /> : Icon}
            </div>
            <div className="min-w-0">
              <p className="text-text-primary font-semibold text-sm truncate">{task.title}</p>
              <p className="text-text-muted text-xs mt-0.5">{task.count}</p>
            </div>
            {task.countNum !== undefined && (
              <span className="ml-auto text-lg font-bold text-text-primary">{task.countNum}</span>
            )}
          </a>
        );
      })}
    </div>
  );
}
