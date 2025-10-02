import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

const LessonArchive = () => {
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Lesson Archive</h1>
            <p className="text-muted-foreground">
              Track lesson completion and generate comprehensive summaries
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant={activeTab === "active" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("active")}
              className="text-sm"
            >
              Active Lessons
            </Button>
            <Button
              variant={activeTab === "completed" ? "secondary" : "ghost"}
              onClick={() => setActiveTab("completed")}
              className="text-sm"
            >
              Completed Archive
            </Button>
            <Button className="bg-orange-600 hover:bg-orange-700 text-white">
              <Plus className="h-4 w-4 mr-2" />
              Record Class Session
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <Card className="p-8">
          {activeTab === "active" ? (
            <div>
              <h2 className="text-lg font-semibold mb-4">Active Lessons (0)</h2>
              <div className="text-center py-12 text-muted-foreground">
                No active lessons yet. Click "Record Class Session" to start recording.
              </div>
            </div>
          ) : (
            <div>
              <h2 className="text-lg font-semibold mb-4">Completed Archive (0)</h2>
              <div className="text-center py-12 text-muted-foreground">
                No completed lessons yet.
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default LessonArchive;
