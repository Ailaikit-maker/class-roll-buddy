import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, List, Network } from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

interface ClassInfo {
  id: string;
  grade: string;
  section: string;
  studentCount: number;
  subjects: string[];
}

interface Teacher {
  id: string;
  name: string;
  email: string;
  subject: string;
  classes: ClassInfo[];
}

const Classes = () => {
  const { toast } = useToast();
  const [viewMode, setViewMode] = useState<"hierarchy" | "list">("hierarchy");
  
  const [teachers] = useState<Teacher[]>([
    {
      id: "1",
      name: "Mrs. Anderson",
      email: "anderson@ailaikit.edu",
      subject: "Mathematics",
      classes: [
        {
          id: "1",
          grade: "Grade 5",
          section: "5A",
          studentCount: 28,
          subjects: ["Mathematics", "English", "Science"]
        }
      ]
    },
    {
      id: "2",
      name: "Mr. Thompson",
      email: "thompson@ailaikit.edu",
      subject: "Science",
      classes: [
        {
          id: "2",
          grade: "Grade 5",
          section: "5B",
          studentCount: 26,
          subjects: ["Science", "Mathematics", "Art"]
        }
      ]
    },
    {
      id: "3",
      name: "Mrs. Garcia",
      email: "garcia@ailaikit.edu",
      subject: "English",
      classes: [
        {
          id: "3",
          grade: "Grade 6",
          section: "6A",
          studentCount: 30,
          subjects: ["English", "Social Studies", "Science"]
        }
      ]
    }
  ]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const getTotalStudents = (teacher: Teacher) => {
    return teacher.classes.reduce((sum, cls) => sum + cls.studentCount, 0);
  };

  const handleAddClass = () => {
    toast({
      title: "Add Class",
      description: "Class creation form will be implemented"
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {teachers.map((teacher) => (
            <Card key={teacher.id} className="overflow-hidden">
              {/* Teacher Header */}
              <div className="bg-teal-50 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12 bg-teal-600">
                      <AvatarFallback className="bg-teal-600 text-white font-semibold">
                        {getInitials(teacher.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{teacher.name}</h3>
                      <p className="text-sm text-teal-700">
                        {teacher.subject} • {teacher.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">{teacher.classes.length}</span> Classes
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-semibold">{getTotalStudents(teacher)}</span> Students
                    </div>
                  </div>
                </div>
              </div>

              {/* Classes List */}
              <CardContent className="p-6 space-y-4">
                {teacher.classes.map((classInfo) => (
                  <div 
                    key={classInfo.id}
                    className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="font-semibold text-gray-900">
                            {classInfo.grade} - {classInfo.section}
                          </h4>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <Users className="h-4 w-4" />
                            <span>{classInfo.studentCount}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <span className="text-sm text-muted-foreground mr-2">Subjects:</span>
                          {classInfo.subjects.map((subject, idx) => (
                            <Badge key={idx} variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                              {subject}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Classes;
