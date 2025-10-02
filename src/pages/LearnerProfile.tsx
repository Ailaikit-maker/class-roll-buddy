import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import { 
  Calendar, 
  AlertCircle, 
  DollarSign, 
  Trophy, 
  Activity,
  Search,
  User,
  BookOpen,
  Award
} from "lucide-react";
import { format } from "date-fns";

type TabType = "overview" | "attendance" | "academics" | "disciplinary" | "finance" | "extracurricular" | "awards";

const LearnerProfile = () => {
  const [selectedChildId, setSelectedChildId] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("overview");

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

  const { data: attendance } = useQuery({
    queryKey: ["attendance", selectedChildId],
    enabled: !!selectedChildId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("child_id", selectedChildId)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: activities } = useQuery({
    queryKey: ["learner-activities", selectedChildId],
    enabled: !!selectedChildId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learner_activities")
        .select(`
          *,
          extracurricular_activities (
            name,
            description,
            category
          )
        `)
        .eq("child_id", selectedChildId);
      if (error) throw error;
      return data;
    },
  });

  const { data: awards } = useQuery({
    queryKey: ["awards", selectedChildId],
    enabled: !!selectedChildId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .eq("child_id", selectedChildId);
      if (error) throw error;
      return data;
    },
  });

  const selectedChild = children?.find(c => c.id === selectedChildId);

  const filteredChildren = children?.filter(child =>
    child.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate stats
  const attendanceRate = attendance && attendance.length > 0
    ? ((attendance.filter(a => a.status === "present").length / attendance.length) * 100).toFixed(1)
    : "0.0";

  const academicAverage = "88.8"; // Mock data
  const activitiesCount = activities?.length || 0;
  const awardsCount = awards?.length || 0;

  const getInitials = (name: string) => {
    return name.split(" ").map(n => n[0]).join("").toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-[calc(100vh-8rem)]">
        {/* Left Sidebar - Student List */}
        <div className="w-80 bg-white border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold text-primary mb-3">Select Student</h3>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="space-y-1">
              {filteredChildren?.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChildId(child.id)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedChildId === child.id
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <div className="font-medium">{child.name}</div>
                  <div className={`text-sm ${selectedChildId === child.id ? "text-white/80" : "text-muted-foreground"}`}>
                    Grade {child.grade} • STU{child.id.slice(0, 3).toUpperCase()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {selectedChild ? (
            <div>
              {/* Student Header - Purple Gradient */}
              <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white p-8">
                <div className="max-w-6xl mx-auto">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 bg-white/20">
                        <AvatarFallback className="bg-white/20 text-white text-xl font-semibold">
                          {getInitials(selectedChild.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-3xl font-bold">{selectedChild.name}</h2>
                        <p className="text-white/90">Grade {selectedChild.grade} • STU{selectedChild.id.slice(0, 3).toUpperCase()}</p>
                        <p className="text-white/80 text-sm">DOB: 15/03/2014</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <div className="mb-1">
                        <span className="text-white/80">Parent Contact:</span>
                        <div className="font-medium">Mrs. Johnson - 082 123 4567</div>
                      </div>
                      <div>
                        <span className="text-white/80">Address:</span>
                        <div className="font-medium">123 Oak Street, Johannesburg</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="bg-white border-b sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-8">
                  <div className="flex gap-2 py-3">
                    <Button
                      variant={activeTab === "overview" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("overview")}
                      className="flex items-center gap-2"
                    >
                      <User className="h-4 w-4" />
                      Overview
                    </Button>
                    <Button
                      variant={activeTab === "attendance" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("attendance")}
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Attendance
                    </Button>
                    <Button
                      variant={activeTab === "academics" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("academics")}
                      className="flex items-center gap-2"
                    >
                      <BookOpen className="h-4 w-4" />
                      Academics
                    </Button>
                    <Button
                      variant={activeTab === "disciplinary" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("disciplinary")}
                      className="flex items-center gap-2"
                    >
                      <AlertCircle className="h-4 w-4" />
                      Disciplinary
                    </Button>
                    <Button
                      variant={activeTab === "finance" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("finance")}
                      className="flex items-center gap-2"
                    >
                      <DollarSign className="h-4 w-4" />
                      Finance
                    </Button>
                    <Button
                      variant={activeTab === "extracurricular" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("extracurricular")}
                      className="flex items-center gap-2"
                    >
                      <Activity className="h-4 w-4" />
                      Extracurricular
                    </Button>
                    <Button
                      variant={activeTab === "awards" ? "default" : "ghost"}
                      size="sm"
                      onClick={() => setActiveTab("awards")}
                      className="flex items-center gap-2"
                    >
                      <Award className="h-4 w-4" />
                      Awards
                    </Button>
                  </div>
                </div>
              </div>

              {/* Tab Content */}
              <div className="max-w-6xl mx-auto px-8 py-6">
                {activeTab === "overview" && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Student Overview</h3>
                    
                    {/* Stats Cards */}
                    <div className="grid grid-cols-4 gap-4 mb-8">
                      <Card className="bg-emerald-50 border-emerald-200">
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl font-bold text-emerald-700">{attendanceRate}%</div>
                          <div className="text-sm text-emerald-600 mt-1">Attendance Rate</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl font-bold text-blue-700">{academicAverage}%</div>
                          <div className="text-sm text-blue-600 mt-1">Academic Average</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-purple-50 border-purple-200">
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl font-bold text-purple-700">{activitiesCount}</div>
                          <div className="text-sm text-purple-600 mt-1">Activities</div>
                        </CardContent>
                      </Card>
                      <Card className="bg-amber-50 border-amber-200">
                        <CardContent className="p-6 text-center">
                          <div className="text-4xl font-bold text-amber-700">{awardsCount}</div>
                          <div className="text-sm text-amber-600 mt-1">Awards</div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Two Column Layout */}
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-semibold mb-4">Recent Academic Performance</h4>
                        <Card>
                          <CardContent className="p-6">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center">
                                <span>Mathematics</span>
                                <span className="font-semibold">92%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>English</span>
                                <span className="font-semibold">89%</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span>Afrikaans</span>
                                <span className="font-semibold">85%</span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <h4 className="font-semibold mb-4">Recent Activities</h4>
                        <Card>
                          <CardContent className="p-6">
                            {activities && activities.length > 0 ? (
                              <div className="space-y-3">
                                {activities.map((activity) => (
                                  <div key={activity.id} className="flex justify-between items-center">
                                    <span>{activity.extracurricular_activities.name}</span>
                                    <span className="text-sm text-muted-foreground">95% attendance</span>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <p className="text-muted-foreground">No activities enrolled</p>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "attendance" && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Attendance Records</h3>
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-2">
                          {attendance && attendance.length > 0 ? (
                            attendance.slice(0, 10).map((record) => (
                              <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                                <span>{format(new Date(record.date), "PPP")}</span>
                                <Badge 
                                  className={
                                    record.status === "present" 
                                      ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100"
                                      : record.status === "late"
                                      ? "bg-amber-100 text-amber-700 hover:bg-amber-100"
                                      : "bg-red-100 text-red-700 hover:bg-red-100"
                                  }
                                >
                                  {record.status}
                                </Badge>
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">No attendance records found</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {activeTab === "awards" && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6">Awards & Achievements</h3>
                    <Card>
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          {awards && awards.length > 0 ? (
                            awards.map((award) => (
                              <div key={award.id} className="border rounded-lg p-4">
                                <div className="flex items-center gap-3 mb-2">
                                  <Trophy className="h-6 w-6 text-yellow-500" />
                                  <div className="flex-1">
                                    <h4 className="font-semibold">{award.award_name}</h4>
                                    <Badge variant="secondary">{award.award_type}</Badge>
                                  </div>
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {format(new Date(award.date_received), "PPP")}
                                </p>
                                {award.description && (
                                  <p className="text-sm mb-2">{award.description}</p>
                                )}
                                {award.awarded_by && (
                                  <p className="text-sm text-muted-foreground">
                                    <strong>Awarded by:</strong> {award.awarded_by}
                                  </p>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-muted-foreground">No awards found</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}

                {/* Other tabs would go here */}
                {activeTab !== "overview" && activeTab !== "attendance" && activeTab !== "awards" && (
                  <div>
                    <h3 className="text-xl font-semibold mb-6 capitalize">{activeTab}</h3>
                    <Card>
                      <CardContent className="p-6">
                        <p className="text-muted-foreground">Content for {activeTab} tab coming soon...</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-muted-foreground">
                <User className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg">Select a student to view their profile</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LearnerProfile;
