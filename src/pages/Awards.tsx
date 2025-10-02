import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GraduationCap, Calendar, Star, Calculator, BookOpen, Trophy, Edit, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Awards = () => {
  const { toast } = useToast();

  const { data: children } = useQuery({
    queryKey: ["children"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("children")
        .select("*")
        .order("name");
      if (error) throw error;
      return data;
    },
  });

  const { data: awards } = useQuery({
    queryKey: ["all-awards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("awards")
        .select(`
          *,
          children (
            name,
            grade
          )
        `)
        .order("date_received", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Mock data for award categories
  const awardCategories = [
    {
      id: 1,
      title: "Academic Excellence",
      icon: <GraduationCap className="h-12 w-12 text-white" />,
      criteria: "Overall average ≥ 90%",
      category: "Academic",
      bgColor: "bg-blue-500",
      qualifiedStudents: ["Sarah Davis", "Olivia Wilson"],
    },
    {
      id: 2,
      title: "Perfect Attendance",
      icon: <Calendar className="h-12 w-12 text-white" />,
      criteria: "Attendance rate ≥ 98%",
      category: "Attendance",
      bgColor: "bg-emerald-500",
      qualifiedStudents: ["Emma Johnson", "Sarah Davis"],
    },
    {
      id: 3,
      title: "Outstanding Behavior",
      icon: <Star className="h-12 w-12 text-white" />,
      criteria: "Behavior points ≥ 95",
      category: "Behavior",
      bgColor: "bg-amber-500",
      qualifiedStudents: ["Emma Johnson", "Sarah Davis", "Olivia Wilson"],
    },
    {
      id: 4,
      title: "Mathematics Excellence",
      icon: <Calculator className="h-12 w-12 text-white" />,
      criteria: "Mathematics average ≥ 90%",
      category: "Academic",
      bgColor: "bg-purple-500",
      qualifiedStudents: ["Emma Johnson", "Sarah Davis", "Olivia Wilson"],
    },
    {
      id: 5,
      title: "English Excellence",
      icon: <BookOpen className="h-12 w-12 text-white" />,
      criteria: "English average ≥ 90%",
      category: "Academic",
      bgColor: "bg-indigo-500",
      qualifiedStudents: ["Sarah Davis", "Olivia Wilson"],
    },
    {
      id: 6,
      title: "Extracurricular Champion",
      icon: <Trophy className="h-12 w-12 text-white" />,
      criteria: "Active in 2+ activities",
      category: "Extracurricular",
      bgColor: "bg-orange-500",
      qualifiedStudents: ["Emma Johnson", "John Smith", "Sarah Davis"],
      moreCount: 2,
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Awards & Recognition</h1>
          <p className="text-muted-foreground mt-1">
            Student achievements, awards qualification and performance analytics
          </p>
        </div>

        {/* Tabs and Action Buttons */}
        <div className="flex items-center justify-between mb-6">
          <Tabs defaultValue="awards" className="w-full">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="awards">Awards</TabsTrigger>
                <TabsTrigger value="top-performers">Top Performers</TabsTrigger>
                <TabsTrigger value="individual-records">Individual Records</TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button
                  variant="default"
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={() => toast({ title: "Edit mode activated" })}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Mode
                </Button>
                <Button
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                  onClick={() => toast({ title: "Exporting PDF..." })}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>

            <TabsContent value="awards" className="mt-6">
              {/* Award Category Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {awardCategories.map((category) => (
                  <Card
                    key={category.id}
                    className={`${category.bgColor} border-none text-white overflow-hidden relative`}
                  >
                    <CardContent className="p-6">
                      {/* Icon and Badge */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="bg-white/20 p-3 rounded-lg">
                          {category.icon}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold">
                            {category.qualifiedStudents.length + (category.moreCount || 0)} Qualified
                          </div>
                          <div className="text-sm text-white/80">{category.category}</div>
                        </div>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl font-bold mb-2">{category.title}</h3>

                      {/* Criteria */}
                      <p className="text-white/90 mb-4">{category.criteria}</p>

                      {/* Qualified Students */}
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-white/90">Qualified Students:</p>
                        {category.qualifiedStudents.map((student, idx) => (
                          <div
                            key={idx}
                            className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded"
                          >
                            {student}
                          </div>
                        ))}
                        {category.moreCount && (
                          <div className="text-right text-sm text-white/80 mt-2">
                            +{category.moreCount} more students
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="top-performers" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    Top Performers view coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="individual-records" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <p className="text-center text-muted-foreground">
                    Individual Records view coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Awards;
