import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import Logo from "@/components/Logo";
import { Calendar, AlertCircle, DollarSign, Trophy, Activity } from "lucide-react";
import { format } from "date-fns";

const LearnerProfile = () => {
  const [selectedChildId, setSelectedChildId] = useState<string>("");

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

  const { data: attendance } = useQuery({
    queryKey: ["attendance", selectedChildId],
    enabled: !!selectedChildId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("attendance_records")
        .select("*")
        .eq("child_id", selectedChildId)
        .order("date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: disciplinary } = useQuery({
    queryKey: ["disciplinary", selectedChildId],
    enabled: !!selectedChildId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("disciplinary_records")
        .select("*")
        .eq("child_id", selectedChildId)
        .order("incident_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: fees } = useQuery({
    queryKey: ["fees", selectedChildId],
    enabled: !!selectedChildId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("school_fees")
        .select("*")
        .eq("child_id", selectedChildId)
        .order("academic_year", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const { data: activities } = useQuery({
    queryKey: ["learner-activities", selectedChildId],
    enabled: !!selectedChildId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("learner_activities")
        .select(`
          *,
          extracurricular_activities (
            name,
            description,
            category,
            instructor,
            schedule
          )
        `)
        .eq("child_id", selectedChildId);
      if (error) throw error;
      return data;
    },
  });

  const { data: awards } = useQuery({
    queryKey: ["awards", selectedChildId],
    enabled: !!selectedChildId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("awards")
        .select("*")
        .eq("child_id", selectedChildId)
        .order("date_received", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const selectedChild = children?.find(c => c.id === selectedChildId);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Logo className="h-12" />
          </div>
          <h1 className="text-3xl font-bold text-primary mb-4">Learner Profile</h1>
          <Select value={selectedChildId} onValueChange={setSelectedChildId}>
            <SelectTrigger className="w-full max-w-md">
              <SelectValue placeholder="Select a learner" />
            </SelectTrigger>
            <SelectContent>
              {children?.map((child) => (
                <SelectItem key={child.id} value={child.id}>
                  {child.name} - Grade {child.grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedChild && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-2xl">{selectedChild.name}</CardTitle>
              <p className="text-muted-foreground">Grade {selectedChild.grade}</p>
            </CardHeader>
          </Card>
        )}

        {selectedChildId && (
          <Tabs defaultValue="attendance" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="attendance">
                <Calendar className="h-4 w-4 mr-2" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="disciplinary">
                <AlertCircle className="h-4 w-4 mr-2" />
                Disciplinary
              </TabsTrigger>
              <TabsTrigger value="finance">
                <DollarSign className="h-4 w-4 mr-2" />
                Finance
              </TabsTrigger>
              <TabsTrigger value="activities">
                <Activity className="h-4 w-4 mr-2" />
                Extracurricular
              </TabsTrigger>
              <TabsTrigger value="awards">
                <Trophy className="h-4 w-4 mr-2" />
                Awards
              </TabsTrigger>
            </TabsList>

            <TabsContent value="attendance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Attendance Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {attendance && attendance.length > 0 ? (
                      attendance.map((record) => (
                        <div key={record.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <span>{format(new Date(record.date), "PPP")}</span>
                          <Badge variant={record.is_present ? "default" : "destructive"}>
                            {record.is_present ? "Present" : "Absent"}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No attendance records found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="disciplinary" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Disciplinary Records</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {disciplinary && disciplinary.length > 0 ? (
                      disciplinary.map((record) => (
                        <div key={record.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{record.incident_type}</h4>
                            <Badge 
                              variant={
                                record.severity === 'serious' ? 'destructive' : 
                                record.severity === 'moderate' ? 'default' : 
                                'secondary'
                              }
                            >
                              {record.severity}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {format(new Date(record.incident_date), "PPP")}
                          </p>
                          {record.description && (
                            <p className="text-sm mb-2">{record.description}</p>
                          )}
                          {record.action_taken && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Action:</strong> {record.action_taken}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No disciplinary records found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="finance" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>School Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {fees && fees.length > 0 ? (
                      fees.map((fee) => (
                        <div key={fee.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="font-semibold text-lg">{fee.academic_year}</h4>
                            <Badge 
                              variant={
                                fee.payment_status === 'paid' ? 'default' : 
                                fee.payment_status === 'partial' ? 'secondary' : 
                                'destructive'
                              }
                            >
                              {fee.payment_status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Total Amount</p>
                              <p className="text-xl font-bold">R {Number(fee.total_amount).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Amount Paid</p>
                              <p className="text-xl font-bold text-green-600">R {Number(fee.amount_paid).toFixed(2)}</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Balance</p>
                              <p className="text-xl font-bold text-red-600">
                                R {(Number(fee.total_amount) - Number(fee.amount_paid)).toFixed(2)}
                              </p>
                            </div>
                            {fee.last_payment_date && (
                              <div>
                                <p className="text-sm text-muted-foreground">Last Payment</p>
                                <p className="text-sm">{format(new Date(fee.last_payment_date), "PPP")}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No fee records found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Extracurricular Activities</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {activities && activities.length > 0 ? (
                      activities.map((la) => (
                        <div key={la.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold">{la.extracurricular_activities.name}</h4>
                            <Badge variant={la.status === 'active' ? 'default' : 'secondary'}>
                              {la.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {la.extracurricular_activities.category}
                          </p>
                          {la.extracurricular_activities.description && (
                            <p className="text-sm mb-2">{la.extracurricular_activities.description}</p>
                          )}
                          <div className="text-sm space-y-1">
                            {la.extracurricular_activities.instructor && (
                              <p><strong>Instructor:</strong> {la.extracurricular_activities.instructor}</p>
                            )}
                            {la.extracurricular_activities.schedule && (
                              <p><strong>Schedule:</strong> {la.extracurricular_activities.schedule}</p>
                            )}
                            <p><strong>Enrolled:</strong> {format(new Date(la.enrollment_date), "PPP")}</p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No activities enrolled</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="awards" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Awards & Achievements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {awards && awards.length > 0 ? (
                      awards.map((award) => (
                        <div key={award.id} className="border rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-2">
                            <Trophy className="h-6 w-6 text-yellow-500" />
                            <div className="flex-1">
                              <h4 className="font-semibold">{award.award_name}</h4>
                              <Badge variant="secondary">{award.award_type}</Badge>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {format(new Date(award.date_received), "PPP")}
                          </p>
                          {award.description && (
                            <p className="text-sm mb-2">{award.description}</p>
                          )}
                          {award.awarded_by && (
                            <p className="text-sm text-muted-foreground">
                              <strong>Awarded by:</strong> {award.awarded_by}
                            </p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">No awards found</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default LearnerProfile;