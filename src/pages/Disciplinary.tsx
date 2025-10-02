import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";
import { Plus, Send, Calendar } from "lucide-react";
import { format } from "date-fns";

const Disciplinary = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [selectedChildId, setSelectedChildId] = useState("");
  const [incidentType, setIncidentType] = useState("");
  const [description, setDescription] = useState("");
  const [severity, setSeverity] = useState("minor");
  const [actionTaken, setActionTaken] = useState("");

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

  const { data: disciplinaryRecords } = useQuery({
    queryKey: ["disciplinary-records"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("disciplinary_records")
        .select(`
          *,
          children (
            name,
            grade
          )
        `)
        .order("incident_date", { ascending: false })
        .limit(10);
      if (error) throw error;
      return data;
    },
  });

  const createRecordMutation = useMutation({
    mutationFn: async (newRecord: any) => {
      const { data, error } = await supabase
        .from("disciplinary_records")
        .insert([newRecord])
        .select();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["disciplinary-records"] });
      toast({
        title: "Record Added",
        description: "Disciplinary record has been created successfully",
      });
      // Reset form
      setSelectedChildId("");
      setIncidentType("");
      setDescription("");
      setSeverity("minor");
      setActionTaken("");
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: "Failed to create disciplinary record",
        variant: "destructive",
      });
      console.error(error);
    },
  });

  const handleAddRecord = () => {
    if (!selectedChildId || !incidentType || !description) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    createRecordMutation.mutate({
      child_id: selectedChildId,
      incident_type: incidentType,
      description: description,
      severity: severity,
      action_taken: actionTaken || null,
      incident_date: new Date().toISOString().split('T')[0],
    });
  };

  const handleSendReport = () => {
    toast({
      title: "Report Sent",
      description: "Disciplinary report has been sent to management",
    });
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "serious":
        return "bg-red-100 text-red-700 hover:bg-red-100";
      case "moderate":
        return "bg-amber-100 text-amber-700 hover:bg-amber-100";
      case "minor":
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-700 hover:bg-gray-100";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Logo className="h-10" />
              <div>
                <h1 className="text-xl font-semibold text-primary">Disciplinary & Intervention</h1>
                <p className="text-sm text-muted-foreground">Track student behavior and interventions</p>
              </div>
            </div>
            <Button 
              onClick={handleSendReport}
              className="bg-orange-600 hover:bg-orange-700"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Report to Management
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Add Record Form */}
          <Card className="bg-orange-50 border-orange-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-900">
                <Plus className="h-5 w-5" />
                Add Disciplinary Record
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={selectedChildId} onValueChange={setSelectedChildId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  {children?.map((child) => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name} - Grade {child.grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Input
                placeholder="Incident Type (e.g., Tardiness, Disruption)"
                value={incidentType}
                onChange={(e) => setIncidentType(e.target.value)}
              />

              <Textarea
                placeholder="Describe the incident in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />

              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="minor">Minor</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="serious">Serious</SelectItem>
                </SelectContent>
              </Select>

              <Textarea
                placeholder="Action taken or intervention applied..."
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                rows={3}
              />

              <Button 
                onClick={handleAddRecord}
                disabled={createRecordMutation.isPending}
                className="w-full bg-orange-600 hover:bg-orange-700"
              >
                {createRecordMutation.isPending ? "Adding..." : "Add Record"}
              </Button>
            </CardContent>
          </Card>

          {/* Right Column - Recent Records */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Recent Records</h3>
            <div className="space-y-4">
              {disciplinaryRecords && disciplinaryRecords.length > 0 ? (
                disciplinaryRecords.map((record) => (
                  <Card key={record.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-semibold text-lg">{record.children.name}</h4>
                            <p className="text-sm text-muted-foreground">Grade {record.children.grade}</p>
                          </div>
                          <div className="flex gap-2">
                            <Badge className={getSeverityColor(record.severity)}>
                              {record.severity.charAt(0).toUpperCase() + record.severity.slice(1)}
                            </Badge>
                            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                              Follow-up Required
                            </Badge>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            <strong>Incident:</strong> {record.incident_type}
                          </p>
                        </div>

                        <div>
                          <p className="text-sm text-gray-700">
                            <strong>Description:</strong> {record.description}
                          </p>
                        </div>

                        {record.action_taken && (
                          <div>
                            <p className="text-sm text-gray-700">
                              <strong>Action Taken:</strong> {record.action_taken}
                            </p>
                          </div>
                        )}

                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{format(new Date(record.incident_date), "dd/MM/yyyy")}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-center">No disciplinary records found</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Disciplinary;
