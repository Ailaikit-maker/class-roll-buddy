import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
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
    }
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            School Management System
          </h1>
          <p className="text-muted-foreground">
            Select a module to get started
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const IconComponent = module.icon;
            
            return (
              <Card 
                key={module.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer group"
                onClick={() => navigate(module.path)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg group-hover:text-primary transition-colors">
                        {module.title}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription>
                    {module.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(module.path);
                    }}
                  >
                    Open {module.title}
                  </Button>
                </CardContent>
              </Card>
            );
          })}

          {/* Add New Module Placeholder */}
          <Card className="border-dashed border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Plus className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                  <CardTitle className="text-muted-foreground">
                    Add New Section
                  </CardTitle>
                  <CardDescription>
                    More modules coming soon
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;