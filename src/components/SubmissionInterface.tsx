import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, AlertCircle, CheckCircle } from "lucide-react";
import { format } from "date-fns";

interface SubmissionInterfaceProps {
  assignmentId: string;
  childId: string;
}

export const SubmissionInterface = ({ assignmentId, childId }: SubmissionInterfaceProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [submissionText, setSubmissionText] = useState("");
  const [isGrading, setIsGrading] = useState(false);
  const [isDetecting, setIsDetecting] = useState(false);

  const { data: assignment } = useQuery({
    queryKey: ["assignment", assignmentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("assignments")
        .select("*")
        .eq("id", assignmentId)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const { data: existingSubmission, refetch: refetchSubmission } = useQuery({
    queryKey: ["submission", assignmentId, childId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("submissions")
        .select("*")
        .eq("assignment_id", assignmentId)
        .eq("child_id", childId)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const submitAssignment = useMutation({
    mutationFn: async (text: string) => {
      const { data, error } = await supabase
        .from("submissions")
        .upsert({
          assignment_id: assignmentId,
          child_id: childId,
          submission_text: text,
          submitted_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["submission", assignmentId, childId] });
      toast({ title: "Submission successful!" });
      
      // Automatically detect AI usage
      detectAI(data.id, submissionText);
    },
    onError: (error: Error) => {
      toast({ title: "Error submitting", description: error.message, variant: "destructive" });
    },
  });

  const detectAI = async (submissionId: string, text: string) => {
    setIsDetecting(true);
    try {
      const { data, error } = await supabase.functions.invoke('detect-ai-usage', {
        body: { submissionId, submissionText: text }
      });

      if (error) throw error;

      toast({
        title: "AI Detection Complete",
        description: data.aiDetected 
          ? `AI usage detected with ${data.confidence}% confidence`
          : "No AI usage detected",
        variant: data.aiDetected ? "destructive" : "default"
      });

      refetchSubmission();
    } catch (error: any) {
      console.error('AI detection error:', error);
      toast({
        title: "AI Detection Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsDetecting(false);
    }
  };

  const gradeSubmission = async () => {
    if (!existingSubmission) return;

    setIsGrading(true);
    try {
      const { data, error } = await supabase.functions.invoke('grade-assignment', {
        body: {
          submissionId: existingSubmission.id,
          assignmentId: assignmentId,
          submissionText: existingSubmission.submission_text
        }
      });

      if (error) throw error;

      toast({
        title: "Grading Complete",
        description: `Grade: ${data.grade}/${assignment?.total_points}`
      });

      refetchSubmission();
    } catch (error: any) {
      console.error('Grading error:', error);
      toast({
        title: "Grading Failed",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsGrading(false);
    }
  };

  const handleSubmit = () => {
    if (!submissionText.trim()) {
      toast({ title: "Please enter your submission", variant: "destructive" });
      return;
    }
    submitAssignment.mutate(submissionText);
  };

  if (!assignment) {
    return <div>Loading...</div>;
  }

  const feedback = existingSubmission?.feedback ? JSON.parse(existingSubmission.feedback) : null;
  const aiDetails = existingSubmission?.ai_detection_details as any;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">{assignment.title}</CardTitle>
              <p className="text-muted-foreground">{assignment.description}</p>
            </div>
            <Badge variant="secondary">{assignment.total_points} points</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {assignment.instructions && (
            <div>
              <h4 className="font-medium mb-2">Instructions:</h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {assignment.instructions}
              </p>
            </div>
          )}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Due:</span>
            <span className="font-medium">{format(new Date(assignment.due_date), "PPP p")}</span>
          </div>
        </CardContent>
      </Card>

      {!existingSubmission ? (
        <Card>
          <CardHeader>
            <CardTitle>Submit Your Work</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              placeholder="Type or paste your submission here..."
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              rows={12}
              className="resize-none"
            />
            <Button 
              onClick={handleSubmit} 
              disabled={submitAssignment.isPending || isDetecting}
              className="w-full gap-2"
            >
              {submitAssignment.isPending || isDetecting ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="h-4 w-4" /> Submit Assignment</>
              )}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Submission</CardTitle>
                <div className="flex gap-2">
                  {existingSubmission.ai_usage_detected && (
                    <Badge variant="destructive" className="gap-1">
                      <AlertCircle className="h-3 w-3" />
                      AI Detected
                    </Badge>
                  )}
                  {existingSubmission.grade !== null ? (
                    <Badge variant="default" className="gap-1">
                      <CheckCircle className="h-3 w-3" />
                      {existingSubmission.grade}/{assignment.total_points}
                    </Badge>
                  ) : (
                    <Button 
                      onClick={gradeSubmission} 
                      disabled={isGrading}
                      size="sm"
                    >
                      {isGrading ? (
                        <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Grading...</>
                      ) : (
                        "Request AI Grading"
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm whitespace-pre-wrap">{existingSubmission.submission_text}</p>
              </div>
              <div className="text-xs text-muted-foreground">
                Submitted: {format(new Date(existingSubmission.submitted_at), "PPP p")}
              </div>
            </CardContent>
          </Card>

          {aiDetails && (
            <Card className={existingSubmission.ai_usage_detected ? "border-destructive" : ""}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  AI Detection Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">Confidence:</span>
                  <Badge variant={aiDetails.confidence > 70 ? "destructive" : "secondary"}>
                    {aiDetails.confidence}%
                  </Badge>
                </div>
                <div>
                  <h4 className="text-sm font-medium mb-2">Summary:</h4>
                  <p className="text-sm text-muted-foreground">{aiDetails.summary}</p>
                </div>
                {aiDetails.indicators && aiDetails.indicators.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Indicators:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {aiDetails.indicators.map((indicator: string, idx: number) => (
                        <li key={idx}>{indicator}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {aiDetails.recommendations && (
                  <div>
                    <h4 className="text-sm font-medium mb-2">Recommendations:</h4>
                    <p className="text-sm text-muted-foreground">{aiDetails.recommendations}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {feedback && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Teacher Feedback</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2">Summary:</h4>
                  <p className="text-sm text-muted-foreground">{feedback.summary}</p>
                </div>
                {feedback.strengths && feedback.strengths.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-green-600">Strengths:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {feedback.strengths.map((strength: string, idx: number) => (
                        <li key={idx}>{strength}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {feedback.improvements && feedback.improvements.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-orange-600">Areas for Improvement:</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                      {feedback.improvements.map((improvement: string, idx: number) => (
                        <li key={idx}>{improvement}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
};