import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Logo from '@/components/Logo';
import { Download, Camera, Plus, Search } from 'lucide-react';

interface Child {
  id: string;
  name: string;
  grade: string;
}

type AttendanceStatus = 'present' | 'late' | 'absent' | 'excused';

interface AttendanceRecord {
  id?: string;
  child_id: string;
  date: string;
  status: AttendanceStatus;
}

const AttendanceRegister = () => {
  const [children, setChildren] = useState<Child[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterGrade, setFilterGrade] = useState('all');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGrade, setNewStudentGrade] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchChildren();
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
      .select('id, child_id, date, status')
      .eq('date', currentDate);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch attendance records",
        variant: "destructive",
      });
    } else {
      setAttendanceRecords((data as any) || []);
    }
  };

  const getChildStatus = (childId: string): AttendanceStatus => {
    const record = attendanceRecords.find(r => r.child_id === childId);
    return record?.status || 'present';
  };

  const updateAttendanceStatus = async (childId: string, status: AttendanceStatus) => {
    setLoading(true);
    
    const existingRecord = attendanceRecords.find(r => r.child_id === childId);
    
    if (existingRecord) {
      const { error } = await supabase
        .from('attendance_records')
        .update({ status })
        .eq('id', existingRecord.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update attendance",
          variant: "destructive",
        });
      } else {
        await fetchAttendanceForDate();
        toast({
          title: "Success",
          description: "Attendance updated",
        });
      }
    } else {
      const { error } = await supabase
        .from('attendance_records')
        .insert({
          child_id: childId,
          date: currentDate,
          status
        });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to record attendance",
          variant: "destructive",
        });
      } else {
        await fetchAttendanceForDate();
        toast({
          title: "Success",
          description: "Attendance recorded",
        });
      }
    }
    
    setLoading(false);
  };

  const addNewStudent = async () => {
    if (!newStudentName || !newStudentGrade) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const { error } = await supabase
      .from('children')
      .insert({
        name: newStudentName,
        grade: newStudentGrade
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to add student",
        variant: "destructive",
      });
    } else {
      await fetchChildren();
      setNewStudentName('');
      setNewStudentGrade('');
      toast({
        title: "Success",
        description: "Student added successfully",
      });
    }
  };

  const statusCounts = {
    present: attendanceRecords.filter(r => r.status === 'present').length,
    late: attendanceRecords.filter(r => r.status === 'late').length,
    absent: attendanceRecords.filter(r => r.status === 'absent').length,
    excused: attendanceRecords.filter(r => r.status === 'excused').length,
  };

  const filteredChildren = children.filter(child => {
    const matchesSearch = child.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGrade = filterGrade === 'all' || child.grade === filterGrade;
    return matchesSearch && matchesGrade;
  });

  const uniqueGrades = Array.from(new Set(children.map(c => c.grade))).sort();

  const getStatusBadgeVariant = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'default';
      case 'late': return 'secondary';
      case 'absent': return 'destructive';
      case 'excused': return 'outline';
      default: return 'default';
    }
  };

  const getStatusColor = (status: AttendanceStatus) => {
    switch (status) {
      case 'present': return 'bg-green-100 text-green-800';
      case 'late': return 'bg-yellow-100 text-yellow-800';
      case 'absent': return 'bg-red-100 text-red-800';
      case 'excused': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-center mb-4">
          <Logo className="h-16" />
        </div>
        
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-primary mb-1">Attendance Register</h1>
            <p className="text-muted-foreground">Track and manage student attendance</p>
          </div>
          <div className="flex gap-2">
            <Button variant="default" className="bg-green-600 hover:bg-green-700">
              <Download className="h-4 w-4 mr-2" />
              Export Register
            </Button>
            <Button variant="default" className="bg-blue-600 hover:bg-blue-700">
              <Camera className="h-4 w-4 mr-2" />
              AI Face Recognition
            </Button>
          </div>
        </div>

        {/* Status Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-green-50 border-green-200">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-green-700">{statusCounts.present}</div>
              <div className="text-green-600 font-medium mt-1">Present</div>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-yellow-700">{statusCounts.late}</div>
              <div className="text-yellow-600 font-medium mt-1">Late</div>
            </CardContent>
          </Card>
          <Card className="bg-red-50 border-red-200">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-red-700">{statusCounts.absent}</div>
              <div className="text-red-600 font-medium mt-1">Absent</div>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="text-4xl font-bold text-blue-700">{statusCounts.excused}</div>
              <div className="text-blue-600 font-medium mt-1">Excused</div>
            </CardContent>
          </Card>
        </div>

        {/* Add New Student */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Add New Student</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Input
                placeholder="Student Name"
                value={newStudentName}
                onChange={(e) => setNewStudentName(e.target.value)}
                className="flex-1"
              />
              <Input
                placeholder="Class (e.g., Grade 5A)"
                value={newStudentGrade}
                onChange={(e) => setNewStudentGrade(e.target.value)}
                className="flex-1"
              />
              <Button onClick={addNewStudent} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="h-4 w-4 mr-2" />
                Add Student
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search students..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterGrade} onValueChange={setFilterGrade}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Classes</SelectItem>
              {uniqueGrades.map((grade) => (
                <SelectItem key={grade} value={grade}>
                  {grade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Student List */}
        <div className="space-y-3">
          {filteredChildren.map((child) => {
            const status = getChildStatus(child.id);
            return (
              <Card key={child.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-semibold text-lg">{child.name}</div>
                      <div className="text-sm text-muted-foreground">{child.grade}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(status)}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </Badge>
                      <Select
                        value={status}
                        onValueChange={(value) => updateAttendanceStatus(child.id, value as AttendanceStatus)}
                        disabled={loading}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="excused">Excused</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredChildren.length === 0 && (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">No students found</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AttendanceRegister;
