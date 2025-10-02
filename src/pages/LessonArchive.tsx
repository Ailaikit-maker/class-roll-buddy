import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Plus, Download, Calendar, Clock } from "lucide-react";

interface LessonSession {
  id: string;
  title: string;
  subject: string;
  grade: string;
  date: string;
  duration: string;
  notes: string;
  status: "active" | "completed";
}

const LessonArchive = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"active" | "completed">("active");
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false);
  const [selectedLessons, setSelectedLessons] = useState<string[]>([]);
  const [lessons, setLessons] = useState<LessonSession[]>([
    {
      id: "1",
      title: "Introduction to Algebra",
      subject: "Mathematics",
      grade: "Grade 9",
      date: "2025-01-15",
      duration: "45 min",
      notes: "Covered basic algebraic expressions and equations",
      status: "completed"
    },
    {
      id: "2",
      title: "Shakespeare's Macbeth",
      subject: "English Literature",
      grade: "Grade 10",
      date: "2025-01-16",
      duration: "60 min",
      notes: "Discussed themes and character analysis",
      status: "completed"
    }
  ]);
  const [newLesson, setNewLesson] = useState({
    title: "",
    subject: "",
    grade: "",
    notes: ""
  });

  const handleRecordLesson = () => {
    const lesson: LessonSession = {
      id: Date.now().toString(),
      title: newLesson.title,
      subject: newLesson.subject,
      grade: newLesson.grade,
      date: new Date().toISOString().split('T')[0],
      duration: "45 min",
      notes: newLesson.notes,
      status: "active"
    };
    setLessons([...lessons, lesson]);
    setNewLesson({ title: "", subject: "", grade: "", notes: "" });
    setIsRecordDialogOpen(false);
    toast({
      title: "Lesson Recorded",
      description: "Class session has been added to active lessons."
    });
  };

  const handleDownloadPDF = async () => {
    if (selectedLessons.length === 0) {
      toast({
        title: "No lessons selected",
        description: "Please select at least one lesson to download.",
        variant: "destructive"
      });
      return;
    }

    const selectedLessonData = lessons.filter(l => selectedLessons.includes(l.id));
    
    toast({
      title: "Generating PDF",
      description: `Merging ${selectedLessons.length} lesson(s) using AI...`
    });

    // Simulate PDF generation
    setTimeout(() => {
      toast({
        title: "PDF Ready",
        description: "Your lesson summary PDF has been generated successfully."
      });
    }, 2000);
  };

  const toggleLessonSelection = (lessonId: string) => {
    setSelectedLessons(prev =>
      prev.includes(lessonId)
        ? prev.filter(id => id !== lessonId)
        : [...prev, lessonId]
    );
  };

  const filteredLessons = lessons.filter(lesson => lesson.status === activeTab);

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
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white"
              onClick={() => setIsRecordDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Record Class Session
            </Button>
          </div>
        </div>

        {/* Download PDF Button */}
        {selectedLessons.length > 0 && (
          <div className="mb-4 flex justify-end">
            <Button 
              onClick={handleDownloadPDF}
              className="bg-primary hover:bg-primary/90"
            >
              <Download className="h-4 w-4 mr-2" />
              Download PDF ({selectedLessons.length} selected)
            </Button>
          </div>
        )}

        {/* Content Area */}
        <Card className="p-8">
          <div>
            <h2 className="text-lg font-semibold mb-4">
              {activeTab === "active" ? "Active Lessons" : "Completed Archive"} ({filteredLessons.length})
            </h2>
            {filteredLessons.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                {activeTab === "active" 
                  ? "No active lessons yet. Click 'Record Class Session' to start recording."
                  : "No completed lessons yet."}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredLessons.map(lesson => (
                  <Card key={lesson.id} className="p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start gap-4">
                      <Checkbox
                        checked={selectedLessons.includes(lesson.id)}
                        onCheckedChange={() => toggleLessonSelection(lesson.id)}
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{lesson.title}</h3>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <span>{lesson.subject} • {lesson.grade}</span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(lesson.date).toLocaleDateString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.duration}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{lesson.notes}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Record Dialog */}
        <Dialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Class Session</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <Label htmlFor="title">Lesson Title</Label>
                <Input
                  id="title"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({...newLesson, title: e.target.value})}
                  placeholder="e.g., Introduction to Algebra"
                />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={newLesson.subject}
                  onChange={(e) => setNewLesson({...newLesson, subject: e.target.value})}
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <Label htmlFor="grade">Grade</Label>
                <Input
                  id="grade"
                  value={newLesson.grade}
                  onChange={(e) => setNewLesson({...newLesson, grade: e.target.value})}
                  placeholder="e.g., Grade 9"
                />
              </div>
              <div>
                <Label htmlFor="notes">Lesson Notes</Label>
                <Textarea
                  id="notes"
                  value={newLesson.notes}
                  onChange={(e) => setNewLesson({...newLesson, notes: e.target.value})}
                  placeholder="Brief description of what was covered..."
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsRecordDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleRecordLesson} className="bg-orange-600 hover:bg-orange-700">
                Record Session
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default LessonArchive;
