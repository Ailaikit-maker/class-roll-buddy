import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Users,
  Calendar,
  AlertTriangle,
  DollarSign,
  MessageCircle,
  Building2,
  FileText,
  GraduationCap,
  UserCog,
  Trophy,
  Activity,
  FolderOpen,
  ClipboardList,
  Database,
  BarChart3,
  MessageSquare,
} from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const mainModules = [
    { id: "home", title: "Home", icon: Users, path: "/", available: true },
    { id: "attendance", title: "Attendance", icon: Users, path: "/register", available: true },
    { id: "learner-profile", title: "Learner Profile", icon: GraduationCap, path: "/learner-profile", available: true },
    { id: "disciplinary", title: "Disciplinary", icon: AlertTriangle, path: "/disciplinary", available: true },
    { id: "finance", title: "Finance", icon: DollarSign, path: "/finance", available: true },
    { id: "activities", title: "Activities", icon: Activity, path: "/activities", available: true },
    { id: "awards", title: "Awards", icon: Trophy, path: "/awards", available: true },
    { id: "assignments", title: "Assignments", icon: FileText, path: "/assignments", available: true },
    { id: "parent-communication", title: "Parent Communication", icon: MessageCircle, path: "/parent-communication", available: true },
  ];

  const managementTools = [
    { id: "planning", title: "Planning", icon: ClipboardList, path: "/planning", available: false },
    { id: "data-hub", title: "Data Hub", icon: Database, path: "/data-hub", available: true },
    { id: "reports", title: "Reports", icon: BarChart3, path: "/reports", available: true },
    { id: "internal-communication", title: "Internal Communication", icon: MessageSquare, path: "/internal-communication", available: false },
    { id: "timetables", title: "Timetables", icon: Calendar, path: "/timetables", available: true },
    { id: "classes", title: "Classes", icon: GraduationCap, path: "/classes", available: true },
    { id: "staff-admin", title: "Staff Admin", icon: UserCog, path: "/staff-admin", available: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <Logo className="h-10" />
            <span className="text-xl font-semibold text-primary">
              Ailaikit School Management
            </span>
          </div>
        </div>
      </header>

      {/* Navigation Banner */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 py-3">
            {mainModules.map((module) => {
              const IconComponent = module.icon;
              const isActive = location.pathname === module.path;
              return (
                <Button
                  key={module.id}
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : module.available
                      ? "hover:bg-primary/10 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => module.available && navigate(module.path)}
                  disabled={!module.available}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm">{module.title}</span>
                  {!module.available && (
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">Soon</span>
                  )}
                </Button>
              );
            })}

            {/* Separator */}
            <div className="h-6 w-px bg-border mx-1"></div>

            {/* Management Tools */}
            {managementTools.map((tool) => {
              const IconComponent = tool.icon;
              const isActive = location.pathname === tool.path;
              return (
                <Button
                  key={tool.id}
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? "bg-violet text-white hover:bg-violet/90"
                      : tool.available
                      ? "hover:bg-violet/10 cursor-pointer"
                      : "opacity-50 cursor-not-allowed"
                  }`}
                  onClick={() => tool.available && navigate(tool.path)}
                  disabled={!tool.available}
                >
                  <IconComponent className="h-4 w-4" />
                  <span className="text-sm">{tool.title}</span>
                  {!tool.available && (
                    <span className="text-xs bg-muted px-1.5 py-0.5 rounded">Soon</span>
                  )}
                </Button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="pt-0">{children}</main>
    </div>
  );
};

export default Layout;
