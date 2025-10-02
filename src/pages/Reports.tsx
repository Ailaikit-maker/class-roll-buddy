import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Calendar, FileText, DollarSign, AlertTriangle, Download, Sparkles, User, FileDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Reports = () => {
  const { toast } = useToast();
  const [reportDescription, setReportDescription] = useState("");
  const [reportType, setReportType] = useState("");
  const [selectedStudent, setSelectedStudent] = useState("all");
  const [selectedClass, setSelectedClass] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

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

  const quickReports = [
    { id: 1, title: "Attendance Summary", icon: Calendar, bgColor: "bg-emerald-500", hoverColor: "hover:bg-emerald-600" },
    { id: 2, title: "Academic Performance", icon: FileText, bgColor: "bg-blue-500", hoverColor: "hover:bg-blue-600" },
    { id: 3, title: "Financial Overview", icon: DollarSign, bgColor: "bg-emerald-500", hoverColor: "hover:bg-emerald-600" },
    { id: 4, title: "Disciplinary Trends", icon: AlertTriangle, bgColor: "bg-orange-500", hoverColor: "hover:bg-orange-600" },
  ];

  const generatedReports = [
    { id: 1, title: "Weekly Attendance Summary", type: "Attendance Report", date: "15/01/2025" },
    { id: 2, title: "Financial Quarter Report", type: "Finance Report", date: "14/01/2025" },
  ];

  // Mock student analytics data
  const studentAnalytics = [
    {
      id: 1,
      name: "John Smith",
      grade: "Grade 5A",
      yearAverage: 78.5,
      attendance: 95.2,
      feesStatus: "Paid",
      amount: "R15,000",
      subjects: [
        { name: "Mathematics", average: 82 },
        { name: "English", average: 75 },
        { name: "Science", average: 80 },
      ],
    },
    {
      id: 2,
      name: "Emma Johnson",
      grade: "Grade 5A",
      yearAverage: 85.3,
      attendance: 92.8,
      feesStatus: "Partial",
      amount: "R8,000",
      subjects: [
        { name: "Mathematics", average: 88 },
        { name: "English", average: 83 },
        { name: "Science", average: 85 },
      ],
    },
    {
      id: 3,
      name: "Michael Brown",
      grade: "Grade 5B",
      yearAverage: 72.1,
      attendance: 88.5,
      feesStatus: "Outstanding",
      amount: "R12,000",
      subjects: [
        { name: "Mathematics", average: 70 },
        { name: "English", average: 74 },
        { name: "Science", average: 72 },
      ],
    },
  ];

  const getFeesStatusColor = (status: string) => {
    switch (status) {
      case "Paid":
        return "bg-emerald-100 text-emerald-800";
      case "Partial":
        return "bg-amber-100 text-amber-800";
      case "Outstanding":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted-foreground mt-1">
            AI-assisted report generation and data analysis
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="reports" className="w-full">
          <div className="flex items-center justify-between mb-6">
            <TabsList>
              <TabsTrigger value="reports">Reports</TabsTrigger>
              <TabsTrigger value="analytics">Analytics Dashboard</TabsTrigger>
            </TabsList>
          </div>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-6">
            {/* AI Report Generator */}
            <Card className="bg-indigo-50 border-indigo-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-indigo-600" />
                  <h2 className="text-xl font-semibold text-indigo-900">AI Report Generator</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Report Description
                    </label>
                    <Textarea
                      placeholder="Describe the report you need (e.g., 'Generate a comprehensive attendance analysis for the past month with trends and recommendations')..."
                      value={reportDescription}
                      onChange={(e) => setReportDescription(e.target.value)}
                      className="min-h-[120px] bg-white"
                    />
                  </div>

                  <div className="flex flex-col justify-between">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Report Type
                      </label>
                      <Select value={reportType} onValueChange={setReportType}>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select Report Type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="attendance">Attendance Report</SelectItem>
                          <SelectItem value="academic">Academic Performance</SelectItem>
                          <SelectItem value="financial">Financial Report</SelectItem>
                          <SelectItem value="disciplinary">Disciplinary Report</SelectItem>
                          <SelectItem value="custom">Custom Report</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white mt-4"
                      onClick={() => toast({ title: "Generating AI Report...", description: "This feature will be available soon." })}
                    >
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate AI Report
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Report Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickReports.map((report) => {
                const IconComponent = report.icon;
                return (
                  <Button
                    key={report.id}
                    className={`${report.bgColor} ${report.hoverColor} text-white h-24 flex flex-col items-center justify-center gap-2 transition-all`}
                    onClick={() => toast({ title: `Generating ${report.title}...` })}
                  >
                    <IconComponent className="h-8 w-8" />
                    <span className="font-semibold">{report.title}</span>
                  </Button>
                );
              })}
            </div>

            {/* Generated Reports */}
            <div>
              <h2 className="text-xl font-semibold mb-4">Generated Reports</h2>
              <div className="space-y-3">
                {generatedReports.map((report) => (
                  <Card key={report.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <FileText className="h-10 w-10 text-muted-foreground" />
                          <div>
                            <h3 className="font-semibold text-lg">{report.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {report.type} • {report.date}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">
                            Generated
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Analytics Dashboard Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Student Analytics Dashboard</h2>
              <div className="flex gap-2">
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export Excel
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 text-white">
                  <FileDown className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
              </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger>
                  <SelectValue placeholder="All Students" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {children?.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Classes</SelectItem>
                  <SelectItem value="5a">Grade 5A</SelectItem>
                  <SelectItem value="5b">Grade 5B</SelectItem>
                  <SelectItem value="6a">Grade 6A</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                <SelectTrigger>
                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="english">English</SelectItem>
                  <SelectItem value="science">Science</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Student Analytics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studentAnalytics.map((student) => (
                <Card key={student.id}>
                  <CardContent className="p-6">
                    {/* Student Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg">{student.name}</h3>
                        <p className="text-sm text-muted-foreground">{student.grade}</p>
                      </div>
                      <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                        <User className="h-6 w-6 text-muted-foreground" />
                      </div>
                    </div>

                    {/* Year Average */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Year Average</span>
                        <span className="text-sm font-semibold">{student.yearAverage}%</span>
                      </div>
                      <Progress value={student.yearAverage} className="h-2" />
                    </div>

                    {/* Attendance */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Attendance</span>
                        <span className="text-sm font-semibold">{student.attendance}%</span>
                      </div>
                      <Progress value={student.attendance} className="h-2 [&>div]:bg-emerald-500" />
                    </div>

                    {/* Fees Status */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">Fees Status</span>
                        <Badge className={getFeesStatusColor(student.feesStatus)}>
                          {student.feesStatus}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Amount</span>
                        <span className="text-sm font-semibold">{student.amount}</span>
                      </div>
                    </div>

                    {/* Subject Averages */}
                    <div>
                      <span className="text-sm font-medium block mb-2">Subject Averages</span>
                      <div className="space-y-2">
                        {student.subjects.map((subject, idx) => (
                          <div key={idx} className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{subject.name}</span>
                            <span className="font-medium">{subject.average}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Reports;
