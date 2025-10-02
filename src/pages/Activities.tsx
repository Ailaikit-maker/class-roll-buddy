import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus } from "lucide-react";

interface TeamMember {
  name: string;
  grade: string;
  position: string;
}

interface Activity {
  id: string;
  name: string;
  category: string;
  description: string;
  schedule: string;
  coach: string;
  memberCount: number;
  teamMembers: TeamMember[];
  colorClass: string;
}

const Activities = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"activities" | "events">("activities");

  // Mock data with vibrant colors - in production, this would come from the database
  const mockActivities: Activity[] = [
    {
      id: "1",
      name: "Cricket",
      category: "Sport",
      description: "School cricket team for competitive matches",
      schedule: "Tuesday & Thursday\n15:30 - 17:00",
      coach: "Mr. Roberts",
      memberCount: 3,
      colorClass: "bg-emerald-500",
      teamMembers: [
        { name: "John Smith", grade: "Grade 5A", position: "Batsman" },
        { name: "Michael Brown", grade: "Grade 5B", position: "Bowler" },
        { name: "James Wilson", grade: "Grade 5B", position: "Wicket Keeper" }
      ]
    },
    {
      id: "2",
      name: "Rugby",
      category: "Sport",
      description: "Rugby team for inter-school competitions",
      schedule: "Monday & Wednesday\n15:30 - 17:00",
      coach: "Mr. Thompson",
      memberCount: 2,
      colorClass: "bg-red-500",
      teamMembers: [
        { name: "David Lee", grade: "Grade 6A", position: "Forward" },
        { name: "Alex Johnson", grade: "Grade 6B", position: "Back" }
      ]
    },
    {
      id: "3",
      name: "Netball",
      category: "Sport",
      description: "Girls netball team",
      schedule: "Tuesday & Friday\n15:30 - 17:00",
      coach: "Mrs. Garcia",
      memberCount: 2,
      colorClass: "bg-pink-500",
      teamMembers: [
        { name: "Emma Johnson", grade: "Grade 5A", position: "Goal Shooter" },
        { name: "Sarah Davis", grade: "Grade 5A", position: "Centre" }
      ]
    },
    {
      id: "4",
      name: "Chess Club",
      category: "Club",
      description: "Strategic thinking and chess competitions",
      schedule: "Wednesday\n14:00 - 15:00",
      coach: "Mrs. Anderson",
      memberCount: 2,
      colorClass: "bg-slate-600",
      teamMembers: [
        { name: "Oliver Chen", grade: "Grade 6A", position: "" },
        { name: "Sophie Williams", grade: "Grade 5B", position: "" }
      ]
    },
    {
      id: "5",
      name: "Drama Club",
      category: "Club",
      description: "Theatre arts and school productions",
      schedule: "Thursday\n14:30 - 16:00",
      coach: "Ms. Lee",
      memberCount: 2,
      colorClass: "bg-purple-600",
      teamMembers: []
    }
  ];

  const handleAddEvent = () => {
    toast({
      title: "Add Event",
      description: "Event creation form will be implemented"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button
              variant={activeTab === "activities" ? "default" : "outline"}
              onClick={() => setActiveTab("activities")}
            >
              Activities
            </Button>
            <Button
              variant={activeTab === "events" ? "default" : "outline"}
              onClick={() => setActiveTab("events")}
            >
              Events & Training
            </Button>
          </div>
          <Button 
            onClick={handleAddEvent}
            className="bg-amber-600 hover:bg-amber-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Event
          </Button>
        </div>

        {/* Activities Grid */}
        {activeTab === "activities" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {mockActivities.map((activity) => (
              <div
                key={activity.id}
                className={`${activity.colorClass} text-white rounded-lg p-6 shadow-lg`}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold mb-1">{activity.name}</h3>
                    <p className="text-white/90 text-sm">{activity.category}</p>
                  </div>
                  <div className="text-right text-sm">
                    <div className="font-semibold">{activity.memberCount} Members</div>
                    <div className="text-white/90">Coach: {activity.coach}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-white/90 text-sm mb-4">{activity.description}</p>

                {/* Schedule */}
                <div className="bg-white/20 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold mb-2 text-sm">Schedule</h4>
                  <p className="text-sm whitespace-pre-line">{activity.schedule}</p>
                </div>

                {/* Team Members */}
                {activity.teamMembers.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-3 text-sm">Team Members:</h4>
                    <div className="space-y-2">
                      {activity.teamMembers.map((member, idx) => (
                        <div
                          key={idx}
                          className="bg-white/20 rounded-lg p-3 flex items-center justify-between"
                        >
                          <div>
                            <div className="font-medium">{member.name}</div>
                            <div className="text-sm text-white/80">{member.grade}</div>
                          </div>
                          {member.position && (
                            <Badge className="bg-white/30 text-white hover:bg-white/40 border-0">
                              {member.position}
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Events & Training Tab */}
        {activeTab === "events" && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">Events & Training content coming soon...</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Activities;
