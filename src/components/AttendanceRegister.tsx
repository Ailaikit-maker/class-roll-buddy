import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Calendar, AlertTriangle, Users, Clock } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  grade: string;
}

interface AttendanceRecord {
  id?: string;
  child_id: string;
  date: string;
  is_present: boolean;
}

interface Escalation {
  id: string;
  child_id: string;
  escalation_type: string;
  absence_count: number;
  period_start: string;
  period_end: string;
  escalated_at: string;
  resolved: boolean;
  children: {
    name: string;
    grade: string;
  };
}

const AttendanceRegister = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    fetchChildren();
    fetchEscalations();
  }, []);

  useEffect(() => {
    if (children.length > 0) {
      fetchAttendanceForDate();
    }
  }, [currentDate, children]);

  const fetchChildren = async () => {
    const { data, error } = await supabase
      .from('children')
      .select('*')
      .order('name');

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch children list",
        variant: "destructive",
      });
    } else {
      setChildren(data || []);
    }
  };

  const fetchAttendanceForDate = async () => {
    const { data, error } = await supabase
      .from('attendance_records')
      .select('*')
      .eq('date', currentDate);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch attendance records",
        variant: "destructive",
      });
    } else {
      setAttendanceRecords(data || []);
    }
  };

  const fetchEscalations = async () => {
    const { data, error } = await supabase
      .from('escalations')
      .select(`
        *,
        children (name, grade)
      `)
      .eq('resolved', false)
      .order('escalated_at', { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch escalations",
        variant: "destructive",
      });
    } else {
      setEscalations(data || []);
    }
  };

  const isChildPresent = (childId: string) => {
    const record = attendanceRecords.find(r => r.child_id === childId);
    return record ? record.is_present : true; // Default to present
  };

  const toggleAttendance = async (childId: string, isPresent: boolean) => {
    setLoading(true);
    
    // Check if record exists
    const existingRecord = attendanceRecords.find(r => r.child_id === childId);
    
    if (existingRecord) {
      // Update existing record
      const { error } = await supabase
        .from('attendance_records')
        .update({
          is_present: isPresent,
          marked_absent_at: !isPresent ? new Date().toISOString() : null
        })
        .eq('id', existingRecord.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update attendance",
          variant: "destructive",
        });
      } else {
        await fetchAttendanceForDate();
        await fetchEscalations(); // Refresh escalations
        toast({
          title: "Success",
          description: "Attendance updated successfully",
        });
      }
    } else {
      // Create new record
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          child_id: childId,
          date: currentDate,
          is_present: isPresent,
          marked_absent_at: !isPresent ? new Date().toISOString() : null
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to record attendance",
          variant: "destructive",
        });
      } else {
        await fetchAttendanceForDate();
        await fetchEscalations(); // Refresh escalations
        toast({
          title: "Success",
          description: "Attendance recorded successfully",
        });
      }
    }
    
    setLoading(false);
  };

  const resolveEscalation = async (escalationId: string) => {
    const { error } = await supabase
      .from('escalations')
      .update({
        resolved: true,
        resolved_at: new Date().toISOString()
      })
      .eq('id', escalationId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to resolve escalation",
        variant: "destructive",
      });
    } else {
      await fetchEscalations();
      toast({
        title: "Success",
        description: "Escalation resolved",
      });
    }
  };

  const presentCount = children.filter(child => isChildPresent(child.id)).length;
  const absentCount = children.length - presentCount;

  return (
    <div className="min-h-screen bg-background p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-primary mb-2">Laerskool Edleen</h1>
          <h2 className="text-2xl font-semibold text-muted-foreground">Attendance Register</h2>
        </div>

        {/* Date Selector and Stats */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-primary" />
            <input
              type="date"
              value={currentDate}
              onChange={(e) => setCurrentDate(e.target.value)}
              className="px-3 py-2 border border-input rounded-md bg-background"
            />
          </div>
          
          <div className="flex gap-4">
            <Badge variant="secondary" className="text-lg px-4 py-2">
              <Users className="h-4 w-4 mr-2" />
              Present: {presentCount}
            </Badge>
            <Badge variant="destructive" className="text-lg px-4 py-2">
              <AlertTriangle className="h-4 w-4 mr-2" />
              Absent: {absentCount}
            </Badge>
          </div>
        </div>

        {/* Escalation Alerts */}
        {escalations.length > 0 && (
          <Card className="mb-6 border-destructive">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" />
                Attendance Escalations ({escalations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {escalations.map((escalation) => (
                  <div key={escalation.id} className="flex items-center justify-between p-3 bg-destructive/10 rounded-lg">
                    <div>
                      <p className="font-semibold">{escalation.children.name} ({escalation.children.grade})</p>
                      <p className="text-sm text-muted-foreground">
                        {escalation.escalation_type === 'monthly' ? 'Monthly' : 'Annual'} escalation: 
                        {escalation.absence_count} absences
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Period: {new Date(escalation.period_start).toLocaleDateString()} - {new Date(escalation.period_end).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      onClick={() => resolveEscalation(escalation.id)}
                      variant="outline"
                      size="sm"
                    >
                      Resolve
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Attendance Register */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Daily Attendance - {new Date(currentDate).toLocaleDateString('en-GB', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {children.map((child) => {
                const isPresent = isChildPresent(child.id);
                return (
                  <div key={child.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                      <div className="w-8 text-center text-sm text-muted-foreground">
                        {children.indexOf(child) + 1}
                      </div>
                      <div>
                        <p className="font-medium">{child.name}</p>
                        <p className="text-sm text-muted-foreground">{child.grade}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge variant={isPresent ? "secondary" : "destructive"}>
                        {isPresent ? "Present" : "Absent"}
                      </Badge>
                      
                      <div className="flex items-center gap-2">
                        <label className="text-sm">Mark Absent:</label>
                        <Checkbox
                          checked={!isPresent}
                          onCheckedChange={(checked) => toggleAttendance(child.id, !checked)}
                          disabled={loading}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AttendanceRegister;