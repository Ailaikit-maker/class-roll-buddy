import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";
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
  Download,
  BarChart3,
  Trophy,
  Activity,
  FolderOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const mainModules = [
    {
      id: "attendance",
      title: "Attendance",
      description: "Track student attendance with comprehensive register",
      icon: Users,
      path: "/register",
      available: true,
      color: "bg-success text-success-foreground"
    },
    {
      id: "learner-profile",
      title: "Learner Profile",
      description: "View comprehensive learner information and records",
      icon: GraduationCap,
      path: "/learner-profile",
      available: true,
      color: "bg-primary text-primary-foreground"
    },
    {
      id: "planning",
      title: "Planning",
      description: "AI-assisted curriculum and lesson planning diary",
      icon: Calendar,
      path: "/planning",
      available: false,
      color: "bg-violet text-violet-foreground"
    },
    {
      id: "disciplinary",
      title: "Disciplinary",
      description: "Student intervention tracking and automated reporting",
      icon: AlertTriangle,
      path: "/disciplinary",
      available: false,
      color: "bg-warning text-warning-foreground"
    },
    {
      id: "finance",
      title: "Finance",
      description: "Comprehensive finance dashboard and analytics",
      icon: DollarSign,
      path: "/finance",
      available: true,
      color: "bg-emerald text-emerald-foreground"
    },
    {
      id: "activities",
      title: "Extracurricular Activities",
      description: "Manage extracurricular activities and enrollments",
      icon: Activity,
      path: "/activities",
      available: true,
      color: "bg-cyan text-cyan-foreground"
    },
    {
      id: "awards",
      title: "Awards",
      description: "Track learner achievements and awards",
      icon: Trophy,
      path: "/awards",
      available: true,
      color: "bg-warning text-warning-foreground"
    },
    {
      id: "assignments",
      title: "AI Assignments",
      description: "Create, submit, and grade assignments with AI",
      icon: FileText,
      path: "/assignments",
      available: true,
      color: "bg-violet text-violet-foreground"
    },
    {
      id: "data-hub",
      title: "Data Hub",
      description: "Central document repository with lessons and resources",
      icon: FolderOpen,
      path: "/data-hub",
      available: true,
      color: "bg-blue text-blue-foreground"
    },
    {
      id: "reports",
      title: "Reports",
      description: "AI-powered report generation and data extraction",
      icon: FileText,
      path: "/reports",
      available: false,
      color: "bg-info text-info-foreground"
    },
    {
      id: "parent-communication",
      title: "Parent Communication",
      description: "Multi-channel messaging with WhatsApp and email",
      icon: MessageCircle,
      path: "/parent-communication",
      available: false,
      color: "bg-pink text-pink-foreground"
    },
    {
      id: "internal-communication",
      title: "Internal Communication",
      description: "Staff messaging system with message archiving",
      icon: Building2,
      path: "/internal-communication",
      available: false,
      color: "bg-cyan text-cyan-foreground"
    }
  ];

  const managementTools = [
    {
      id: "timetables",
      title: "Timetables",
      description: "AI-powered timetable generation and management",
      icon: Calendar,
      path: "/timetables",
      available: true,
      color: "bg-violet text-violet-foreground"
    },
    {
      id: "classes",
      title: "Classes",
      description: "Hierarchical class management by teacher",
      icon: GraduationCap,
      path: "/classes",
      available: true,
      color: "bg-emerald text-emerald-foreground"
    },
    {
      id: "staff-admin",
      title: "Staff Administration",
      description: "Comprehensive staff management system",
      icon: UserCog,
      path: "/staff-admin",
      available: true,
      color: "bg-slate text-slate-foreground"
    }
  ];

  const exportOptions = [
    { label: "Excel", icon: BarChart3 },
    { label: "Word", icon: FileText },
    { label: "PDF", icon: Download }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simplified Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16 gap-3">
            <Logo className="h-10" />
            <span className="text-xl font-semibold text-primary">Ailaikit School Management</span>
          </div>
        </div>
      </header>

      {/* Compact Navigation Banner */}
      <div className="bg-white border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-2 py-3">
            {mainModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <Button
                  key={module.id}
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 whitespace-nowrap transition-colors ${
                    module.available 
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
              return (
                <Button
                  key={tool.id}
                  variant="ghost"
                  size="sm"
                  className={`flex items-center gap-2 whitespace-nowrap transition-colors ${
                    tool.available 
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Your Dashboard
          </h1>
          <p className="text-lg text-gray-600">
            Quick access to all your school management tools
          </p>
        </div>

        {/* Main Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {mainModules.map((module) => {
            const IconComponent = module.icon;
            
            return (
              <Card 
                key={module.id} 
                className={`${module.color} hover:shadow-lg transition-all duration-300 cursor-pointer border-0 overflow-hidden relative group ${
                  !module.available ? 'opacity-75' : ''
                }`}
                onClick={() => module.available && navigate(module.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <IconComponent className="h-8 w-8 mb-3" />
                      <CardTitle className="text-xl mb-1">
                        {module.title}
                      </CardTitle>
                    </div>
                    <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10"></div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-current/90 text-sm leading-relaxed">
                    {module.description}
                  </CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Management Tools Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <div className="w-1 h-6 bg-primary rounded mr-3"></div>
            Management Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {managementTools.map((tool) => {
              const IconComponent = tool.icon;
              
              return (
                <Card 
                  key={tool.id} 
                  className={`${tool.color} hover:shadow-lg transition-all duration-300 cursor-pointer border-0 overflow-hidden relative group ${
                    !tool.available ? 'opacity-75' : ''
                  }`}
                  onClick={() => tool.available && navigate(tool.path)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <IconComponent className="h-8 w-8 mb-3" />
                        <CardTitle className="text-xl mb-1">
                          {tool.title}
                        </CardTitle>
                      </div>
                      <div className="absolute -top-4 -right-4 w-16 h-16 rounded-full bg-white/10"></div>
                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white/5"></div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-current/90 text-sm leading-relaxed">
                      {tool.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;