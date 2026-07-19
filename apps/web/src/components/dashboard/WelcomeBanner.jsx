import Badge from "../ui/Badge";

export default function WelcomeBanner({
  initials = "JD",
  name = "User",
  subtitle = "Selamat datang kembali!",
  roleBadge = "Admin",
  roleBadgeColor = "default",
}) {
  return (
    <div className="bg-bg-card border border-border-subtle rounded-[20px] shadow-lux p-6 flex items-center gap-5">
      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary to-teal flex items-center justify-center text-white font-bold text-lg shrink-0">
        {initials}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-text-primary text-xl font-bold truncate">
            Welcome back, {name}
          </h1>
          <Badge variant={roleBadgeColor}>{roleBadge}</Badge>
        </div>
        <p className="text-text-secondary text-sm mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
}
