import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Upload, Eye, FileText, Users, Target, AlertTriangle, TrendingUp, Download, Sparkles, CheckCircle } from "lucide-react";
import { format } from "date-fns";

const Assignments = () => {
  const [selectedTab, setSelectedTab] = useState("assignments");

  const { data: assignments } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("*, children(name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: submissions } = useQuery({
    queryKey: ["all-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*, assignments(title, total_points), children(name, grade)")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  // Calculate analytics
  const totalAssignments = assignments?.length || 0;
  const totalSubmissions = submissions?.length || 0;
  const gradedSubmissions = submissions?.filter(s => s.grade !== null) || [];
  const averageGrade = gradedSubmissions.length > 0
    ? Math.round((gradedSubmissions.reduce((acc, s) => acc + Number(s.grade), 0) / gradedSubmissions.length))
    : 0;
  const aiFlaggedCount = submissions?.filter(s => s.ai_usage_detected)?.length || 0;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">AI-Powered Assignments</h1>
          <p className="text-muted-foreground">
            Automated grading, AI detection, and comprehensive assignment management
          </p>
        </div>

        {/* Tabs */}
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
          <div className="flex justify-end mb-6">
            <TabsList>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="submissions">Submissions</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>
          </div>

          {/* Assignments Tab */}
          <TabsContent value="assignments" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignments?.map((assignment) => {
                const submissionCount = submissions?.filter(s => s.assignment_id === assignment.id).length || 0;
                const totalStudents = 28; // Mock total
                const submissionPercentage = (submissionCount / totalStudents) * 100;

                return (
                  <Card key={assignment.id} className="relative">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <CardTitle className="text-lg leading-tight">{assignment.title}</CardTitle>
                        <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100 shrink-0 border-0">
                          Published
                        </Badge>
                      </div>
                      <CardDescription className="text-sm text-muted-foreground">
                        Mathematics • Grade {assignment.grade || "5"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        {assignment.description}
                      </p>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Due Date:</span>
                          <span className="font-medium">
                            {format(new Date(assignment.due_date), "dd/MM/yyyy")}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Max Score:</span>
                          <span className="font-medium">{assignment.total_points} points</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Submissions:</span>
                          <span className="font-medium">{submissionCount}/{totalStudents}</span>
                        </div>
                      </div>

                      <Progress value={submissionPercentage} className="h-2" />

                      <div className="flex gap-2 pt-2">
                        <Button className="flex-1 gap-2">
                          <Upload className="h-4 w-4" />
                          Upload
                        </Button>
                        <Button variant="outline" className="gap-2">
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Submissions Tab */}
          <TabsContent value="submissions" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Assignment Submissions</h2>
            
            <div className="space-y-6">
              {submissions?.slice(0, 1).map((submission) => {
                const aiPercentage = 2; // Mock AI detection percentage
                
                return (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-xl mb-1">
                            {submission.children?.name || "Emma Johnson"}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground">
                            Grade {submission.children?.grade || "5A"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Submitted: {format(new Date(submission.submitted_at), "dd/MM/yyyy")}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge className="bg-green-100 text-green-700 hover:bg-green-100 mb-2">
                            Graded
                          </Badge>
                          <div className="text-3xl font-bold text-green-600">
                            {submission.grade ? Math.round((Number(submission.grade) / (submission.assignments?.total_points || 100)) * 100) : 87}%
                          </div>
                          <p className="text-xs text-muted-foreground">AI Grade</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* File Download */}
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <p className="text-sm font-medium">
                              emma_fractions_assignment.pdf
                            </p>
                            <p className="text-xs text-muted-foreground">(2.3 MB)</p>
                          </div>
                        </div>
                        <Button variant="link" className="gap-2">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </div>

                      {/* AI Detection */}
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <h3 className="font-semibold">AI Detection Analysis</h3>
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm font-medium text-green-600">
                              {aiPercentage}% AI Usage
                            </span>
                          </div>
                        </div>
                        <Progress value={aiPercentage} className="h-2" />
                      </div>

                      {/* Rubric Breakdown */}
                      <div>
                        <h3 className="font-semibold mb-4">Rubric Breakdown:</h3>
                        <div className="space-y-4">
                          <div className="border-b pb-3">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <p className="font-medium">Understanding of Concepts</p>
                                <p className="text-sm text-muted-foreground">
                                  Shows excellent grasp of fraction fundamentals
                                </p>
                              </div>
                              <span className="font-bold">45/50</span>
                            </div>
                          </div>
                          
                          <div className="border-b pb-3">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <p className="font-medium">Problem Solving</p>
                                <p className="text-sm text-muted-foreground">
                                  Good problem-solving approach with minor calculation error
                                </p>
                              </div>
                              <span className="font-bold">35/40</span>
                            </div>
                          </div>
                          
                          <div className="border-b pb-3">
                            <div className="flex justify-between items-start mb-1">
                              <div>
                                <p className="font-medium">Written Explanation</p>
                                <p className="text-sm text-muted-foreground">
                                  Clear explanations, could be more detailed
                                </p>
                              </div>
                              <span className="font-bold">7/10</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* AI Feedback */}
                      <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                          <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                          <h3 className="font-semibold text-blue-900 dark:text-blue-100">
                            AI Feedback
                          </h3>
                        </div>
                        <p className="text-sm text-blue-900 dark:text-blue-100">
                          {submission.feedback || 
                            "Excellent understanding of fraction concepts. Clear explanations and accurate calculations. Minor error in problem 3."}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-semibold mb-4">Assignment Analytics</h2>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Card className="bg-blue-50 dark:bg-blue-950/20 border-blue-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <FileText className="h-8 w-8 text-blue-600" />
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="text-3xl font-bold text-blue-700">{totalAssignments}</div>
                  <p className="text-sm text-blue-700">Total Assignments</p>
                </CardContent>
              </Card>

              <Card className="bg-green-50 dark:bg-green-950/20 border-green-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <Users className="h-8 w-8 text-green-600" />
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="text-3xl font-bold text-green-700">{totalSubmissions}</div>
                  <p className="text-sm text-green-700">Total Submissions</p>
                </CardContent>
              </Card>

              <Card className="bg-yellow-50 dark:bg-yellow-950/20 border-yellow-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <Target className="h-8 w-8 text-yellow-600" />
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div className="text-3xl font-bold text-yellow-700">{averageGrade}%</div>
                  <p className="text-sm text-yellow-700">Average Grade</p>
                </CardContent>
              </Card>

              <Card className="bg-red-50 dark:bg-red-950/20 border-red-100">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-2">
                    <AlertTriangle className="h-8 w-8 text-red-600" />
                    <TrendingUp className="h-5 w-5 text-red-600" />
                  </div>
                  <div className="text-3xl font-bold text-red-700">{aiFlaggedCount}</div>
                  <p className="text-sm text-red-700">AI Flagged Submissions</p>
                </CardContent>
              </Card>
            </div>

            {/* Performance Sections */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Assignment Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Assignment Performance</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assignments?.slice(0, 2).map((assignment, idx) => {
                    const submissionCount = submissions?.filter(s => s.assignment_id === assignment.id).length || 0;
                    const percentage = idx === 0 ? 82 : 0;
                    
                    return (
                      <div key={assignment.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{assignment.title}</span>
                          <span className="font-bold">{percentage}%</span>
                        </div>
                        <Progress 
                          value={percentage} 
                          className="h-2"
                        />
                      </div>
                    );
                  })}
                </CardContent>
              </Card>

              {/* AI Detection Summary */}
              <Card>
                <CardHeader>
                  <CardTitle>AI Detection Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {assignments?.slice(0, 2).map((assignment, idx) => {
                    const flagged = idx === 0 ? "1/2" : "0/0";
                    const color = idx === 0 ? "text-red-600" : "text-green-600";
                    
                    return (
                      <div key={assignment.id} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{assignment.title}</span>
                          <span className={`font-bold ${color}`}>
                            {flagged} flagged
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={idx === 0 ? "h-full bg-red-500 w-1/2" : "h-full bg-green-500 w-0"}
                          />
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Assignments;
