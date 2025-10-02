import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Download, Upload, Users, Clock, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";

interface Student {
  id: string;
  name: string;
  subjects: string[];
}

interface TimetableEntry {
  student: string;
  subject: string;
  day: string;
  time: string;
  teacher: string;
}

const timeSlots = [
  "08:00-08:45",
  "08:45-09:30",
  "09:30-10:15",
  "10:15-11:00",
  "11:00-11:45",
  "11:45-12:30",
  "13:30-14:15",
  "14:15-15:00"
];

const Timetables = () => {
  const { toast } = useToast();
  const [studentName, setStudentName] = useState("");
  const [subjects, setSubjects] = useState("");
  const [students, setStudents] = useState<Student[]>([
    { id: "1", name: "John Smith", subjects: ["Mathematics", "English", "Science"] },
    { id: "2", name: "Emma Johnson", subjects: ["Mathematics", "English", "Art"] }
  ]);
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<string[]>([]);
  const [generatedTimetable, setGeneratedTimetable] = useState<TimetableEntry[]>([
    { student: "John Smith", subject: "Mathematics", day: "Monday", time: "08:00-08:45", teacher: "Mrs. Anderson" },
    { student: "John Smith", subject: "English", day: "Monday", time: "08:45-09:30", teacher: "Mrs. Garcia" }
  ]);

  const handleAddStudent = () => {
    if (!studentName.trim() || !subjects.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter both student name and subjects",
        variant: "destructive"
      });
      return;
    }

    const subjectList = subjects.split(",").map(s => s.trim()).filter(s => s);
    const newStudent: Student = {
      id: Date.now().toString(),
      name: studentName,
      subjects: subjectList
    };

    setStudents([...students, newStudent]);
    setStudentName("");
    setSubjects("");
    
    toast({
      title: "Student Added",
      description: `${studentName} has been added successfully`
    });
  };

  const toggleTimeSlot = (slot: string) => {
    setSelectedTimeSlots(prev =>
      prev.includes(slot)
        ? prev.filter(s => s !== slot)
        : [...prev, slot]
    );
  };

  const handleGenerateTimetable = () => {
    if (students.length === 0) {
      toast({
        title: "No Students",
        description: "Please add students before generating timetable",
        variant: "destructive"
      });
      return;
    }

    if (selectedTimeSlots.length === 0) {
      toast({
        title: "No Time Slots",
        description: "Please select time slots before generating timetable",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Generating Timetable",
      description: "AI is creating your timetable..."
    });

    // Simulate AI generation
    setTimeout(() => {
      const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
      const teachers = ["Mrs. Anderson", "Mrs. Garcia", "Mr. Smith", "Ms. Johnson", "Dr. Williams"];
      const newTimetable: TimetableEntry[] = [];

      students.forEach(student => {
        student.subjects.forEach((subject, idx) => {
          if (selectedTimeSlots[idx % selectedTimeSlots.length]) {
            newTimetable.push({
              student: student.name,
              subject: subject,
              day: days[idx % days.length],
              time: selectedTimeSlots[idx % selectedTimeSlots.length],
              teacher: teachers[idx % teachers.length]
            });
          }
        });
      });

      setGeneratedTimetable(newTimetable);
      toast({
        title: "Timetable Generated",
        description: "Your timetable has been created successfully"
      });
    }, 1500);
  };

  const handleExportTimetable = () => {
    toast({
      title: "Exporting Timetable",
      description: "Your timetable will be downloaded shortly"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Add Student & Subjects */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-primary">
                  <Users className="h-5 w-5" />
                  Add Student & Subjects
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Input
                  placeholder="Student Name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                />
                <Input
                  placeholder="Subjects (comma-separated, e.g., Mathematics, English, Science)"
                  value={subjects}
                  onChange={(e) => setSubjects(e.target.value)}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleAddStudent}
                    className="flex-1 bg-primary hover:bg-primary/90"
                  >
                    Add Student
                  </Button>
                  <Button 
                    variant="secondary"
                    className="bg-secondary hover:bg-secondary/80"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Excel
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Select Time Slots */}
            <Card className="border-violet/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-violet">
                  <Clock className="h-5 w-5" />
                  Select Time Slots
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {timeSlots.map((slot) => (
                    <div key={slot} className="flex items-center space-x-2">
                      <Checkbox
                        id={slot}
                        checked={selectedTimeSlots.includes(slot)}
                        onCheckedChange={() => toggleTimeSlot(slot)}
                      />
                      <label
                        htmlFor={slot}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {slot}
                      </label>
                    </div>
                  ))}
                </div>
                <Button 
                  onClick={handleGenerateTimetable}
                  className="w-full mt-6 bg-violet hover:bg-violet/90 text-white"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  Generate AI Timetable
                </Button>
              </CardContent>
            </Card>

            {/* Students List */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Students ({students.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {students.map((student) => (
                  <div key={student.id} className="p-4 bg-muted rounded-lg">
                    <h3 className="font-semibold mb-2">{student.name}</h3>
                    <div className="flex flex-wrap gap-2">
                      {student.subjects.map((subject, idx) => (
                        <Badge key={idx} variant="secondary">
                          {subject}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Generated Timetable */}
          <div>
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Generated Timetable
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-muted/50">
                        <th className="p-3 text-left font-semibold">STUDENT</th>
                        <th className="p-3 text-left font-semibold">SUBJECT</th>
                        <th className="p-3 text-left font-semibold">DAY</th>
                        <th className="p-3 text-left font-semibold">TIME</th>
                        <th className="p-3 text-left font-semibold">TEACHER</th>
                      </tr>
                    </thead>
                    <tbody>
                      {generatedTimetable.map((entry, idx) => (
                        <tr key={idx} className="border-b hover:bg-muted/30">
                          <td className="p-3">{entry.student}</td>
                          <td className="p-3">{entry.subject}</td>
                          <td className="p-3">{entry.day}</td>
                          <td className="p-3 text-muted-foreground">{entry.time}</td>
                          <td className="p-3">{entry.teacher}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Timetables;
