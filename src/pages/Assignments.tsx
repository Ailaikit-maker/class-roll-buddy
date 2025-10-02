import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { PlusCircle, BookOpen, FileText, Award, AlertCircle } from "lucide-react";
import { format } from "date-fns";

const Assignments = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    instructions: "",
    due_date: "",
    total_points: 100,
    grade: "",
    child_id: ""
  });

  const [rubrics, setRubrics] = useState<Array<{ criteria: string; points: number; description: string }>>([
    { criteria: "", points: 0, description: "" }
  ]);

  const { data: assignments } = useQuery({
    queryKey: ["assignments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("*, children(name), submissions(count)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

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

  const { data: submissions } = useQuery({
    queryKey: ["all-submissions"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*, assignments(title), children(name)")
        .order("submitted_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createAssignment = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { data: assignment, error } = await supabase
        .from("assignments")
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;

      // Insert rubrics if any
      if (rubrics.some(r => r.criteria)) {
        const rubricData = rubrics
          .filter(r => r.criteria)
          .map(r => ({ ...r, assignment_id: assignment.id }));
        
        const { error: rubricError } = await supabase
          .from("grading_rubrics")
          .insert(rubricData);
        
        if (rubricError) throw rubricError;
      }

      return assignment;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["assignments"] });
      toast({ title: "Assignment created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ title: "Error creating assignment", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      instructions: "",
      due_date: "",
      total_points: 100,
      grade: "",
      child_id: ""
    });
    setRubrics([{ criteria: "", points: 0, description: "" }]);
  };

  const handleSubmit = () => {
    createAssignment.mutate(formData);
  };

  const addRubric = () => {
    setRubrics([...rubrics, { criteria: "", points: 0, description: "" }]);
  };

  const updateRubric = (index: number, field: string, value: any) => {
    const newRubrics = [...rubrics];
    newRubrics[index] = { ...newRubrics[index], [field]: value };
    setRubrics(newRubrics);
  };

  const removeRubric = (index: number) => {
    setRubrics(rubrics.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Logo className="h-14" />
            <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-primary">AI Assignments</h1>
              <p className="text-muted-foreground">Create, submit, and grade assignments with AI assistance</p>
            </div>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Create Assignment
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Create New Assignment</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Assignment title"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Description</label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Instructions</label>
                  <Textarea
                    value={formData.instructions}
                    onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
                    placeholder="Detailed instructions for students"
                    rows={4}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Due Date</label>
                    <Input
                      type="datetime-local"
                      value={formData.due_date}
                      onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Total Points</label>
                    <Input
                      type="number"
                      value={formData.total_points}
                      onChange={(e) => setFormData({ ...formData, total_points: parseInt(e.target.value) })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Grade</label>
                    <Input
                      value={formData.grade}
                      onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                      placeholder="e.g., Grade 5"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Assign to Learner (Optional)</label>
                    <Select value={formData.child_id} onValueChange={(value) => setFormData({ ...formData, child_id: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="All learners" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All learners</SelectItem>
                        {children?.map((child) => (
                          <SelectItem key={child.id} value={child.id}>
                            {child.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-sm font-medium">Grading Rubric</label>
                    <Button type="button" variant="outline" size="sm" onClick={addRubric}>
                      Add Criteria
                    </Button>
                  </div>
                  {rubrics.map((rubric, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 mb-2">
                      <Input
                        className="col-span-5"
                        placeholder="Criteria"
                        value={rubric.criteria}
                        onChange={(e) => updateRubric(index, 'criteria', e.target.value)}
                      />
                      <Input
                        className="col-span-2"
                        type="number"
                        placeholder="Points"
                        value={rubric.points}
                        onChange={(e) => updateRubric(index, 'points', parseInt(e.target.value) || 0)}
                      />
                      <Input
                        className="col-span-4"
                        placeholder="Description"
                        value={rubric.description}
                        onChange={(e) => updateRubric(index, 'description', e.target.value)}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="col-span-1"
                        onClick={() => removeRubric(index)}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>

                <Button onClick={handleSubmit} className="w-full">
                  Create Assignment
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="assignments" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="assignments">
              <FileText className="h-4 w-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="submissions">
              <Award className="h-4 w-4 mr-2" />
              Submissions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="assignments" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {assignments && assignments.length > 0 ? (
                assignments.map((assignment) => (
                  <Card key={assignment.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg mb-2">{assignment.title}</CardTitle>
                          <p className="text-sm text-muted-foreground line-clamp-2">{assignment.description}</p>
                        </div>
                        <Badge variant="secondary">{assignment.total_points} pts</Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2 text-sm">
                        {assignment.grade && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Grade:</span>
                            <span className="font-medium">{assignment.grade}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Due:</span>
                          <span>{format(new Date(assignment.due_date), "PPP")}</span>
                        </div>
                        {assignment.children && (
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">Assigned to:</span>
                            <span>{assignment.children.name}</span>
                          </div>
                        )}
                        <div className="pt-2 border-t">
                          <span className="text-muted-foreground">Submissions:</span>
                          <span className="ml-2 font-medium">{assignment.submissions?.[0]?.count || 0}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No assignments yet. Create your first one!</p>
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="submissions" className="mt-6">
            <div className="space-y-4">
              {submissions && submissions.length > 0 ? (
                submissions.map((submission) => (
                  <Card key={submission.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{submission.assignments.title}</CardTitle>
                          <p className="text-sm text-muted-foreground">
                            by {submission.children.name}
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          {submission.grade !== null && (
                            <Badge variant="default">{submission.grade} points</Badge>
                          )}
                          {submission.ai_usage_detected && (
                            <Badge variant="destructive" className="gap-1">
                              <AlertCircle className="h-3 w-3" />
                              AI Detected
                            </Badge>
                          )}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm mb-4 line-clamp-3">{submission.submission_text}</p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>Submitted: {format(new Date(submission.submitted_at), "PPP p")}</span>
                        {submission.graded_at && (
                          <span>Graded: {format(new Date(submission.graded_at), "PPP")}</span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No submissions yet</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Assignments;