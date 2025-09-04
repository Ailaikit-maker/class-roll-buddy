import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus, Calendar, AlertTriangle, DollarSign, MessageCircle, Building2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const modules = [
    {
      id: "register",
      title: "Register",
      description: "Attendance tracking and management",
      icon: Users,
      path: "/register",
      available: true
    },
    {
      id: "planning",
      title: "Planning",
      description: "Curriculum and lesson planning",
      icon: Calendar,
      path: "/planning",
      available: false
    },
    {
      id: "disciplinary",
      title: "Disciplinary & Intervention",
      description: "Student behavior management",
      icon: AlertTriangle,
      path: "/disciplinary",
      available: false
    },
    {
      id: "finance",
      title: "Finance",
      description: "Budget and financial management",
      icon: DollarSign,
      path: "/finance",
      available: false
    },
    {
      id: "parent-communication",
      title: "Parent Communication",
      description: "Connect with parents and guardians",
      icon: MessageCircle,
      path: "/parent-communication",
      available: false
    },
    {
      id: "internal-communication",
      title: "Internal Communication",
      description: "Staff and internal messaging",
      icon: Building2,
      path: "/internal-communication",
      available: false
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Ailaikit School Management System
          </h1>
          <p className="text-muted-foreground">
            Select a module to get started
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {modules.map((module) => {
            const IconComponent = module.icon;
            
            return (
              <Card 
                key={module.id} 
                className={`hover:shadow-md transition-all cursor-pointer group ${
                  !module.available ? 'opacity-60' : ''
                }`}
                onClick={() => module.available && navigate(module.path)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-base group-hover:text-primary transition-colors">
                        {module.title}
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm mb-3">
                    {module.description}
                  </CardDescription>
                  <Button 
                    size="sm"
                    className="w-full"
                    disabled={!module.available}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (module.available) navigate(module.path);
                    }}
                  >
                    {module.available ? 'Open' : 'Coming Soon'}
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {/* Add New Module Placeholder */}
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-center">
                <div className="text-center">
                  <Plus className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <CardTitle className="text-base text-muted-foreground">
                    Add Module
                  </CardTitle>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm text-center">
                Expand your system
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;