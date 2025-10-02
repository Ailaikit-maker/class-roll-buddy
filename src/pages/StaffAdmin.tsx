import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Search, Mail, Phone, Calendar } from "lucide-react";
import Logo from "@/components/Logo";
import { useToast } from "@/hooks/use-toast";

interface StaffMember {
  id: string;
  name: string;
  role: string;
  position: string;
  scale: string;
  email: string;
  phone: string;
  status: "Active" | "On Leave";
  category: "Academic" | "Non-Academic";
  hiredDate: string;
}

const StaffAdmin = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("all");

  const [staffMembers] = useState<StaffMember[]>([
    {
      id: "1",
      name: "Mrs. Anderson",
      role: "Mathematics Teacher",
      position: "Senior Teacher",
      scale: "Scale 7",
      email: "anderson@ailaikit.edu",
      phone: "+27 11 123 4567",
      status: "Active",
      category: "Academic",
      hiredDate: "15/02/2020"
    },
    {
      id: "2",
      name: "Mr. Thompson",
      role: "Science Teacher",
      position: "Teacher",
      scale: "Scale 5",
      email: "thompson@ailaikit.edu",
      phone: "+27 11 123 4568",
      status: "Active",
      category: "Academic",
      hiredDate: "20/08/2019"
    },
    {
      id: "3",
      name: "Mrs. Garcia",
      role: "English Teacher",
      position: "Head of Department",
      scale: "Scale 8",
      email: "garcia@ailaikit.edu",
      phone: "+27 11 123 4569",
      status: "On Leave",
      category: "Academic",
      hiredDate: "10/01/2021"
    }
  ]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  const stats = {
    active: staffMembers.filter(s => s.status === "Active").length,
    onLeave: staffMembers.filter(s => s.status === "On Leave").length,
    academic: staffMembers.filter(s => s.category === "Academic").length,
    total: staffMembers.length
  };

  const handleAddStaff = () => {
    toast({
      title: "Add Staff Member",
      description: "Staff member form will be implemented"
    });
  };

  const handleEditGrade = (name: string) => {
    toast({
      title: "Edit Grade/Salary",
      description: `Editing grade and salary for ${name}`
    });
  };

  const filteredStaff = staffMembers.filter(staff =>
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Logo className="h-10" />
              <div>
                <h1 className="text-xl font-semibold text-primary">Staff Administration</h1>
                <p className="text-sm text-muted-foreground">Comprehensive staff management and records</p>
              </div>
            </div>
            <Button onClick={handleAddStaff} className="bg-slate-700 hover:bg-slate-800">
              <Plus className="mr-2 h-4 w-4" />
              Add Staff Member
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-emerald-50 border-emerald-200">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-emerald-700">{stats.active}</div>
              <div className="text-sm text-emerald-600 font-medium mt-1">Active Staff</div>
            </CardContent>
          </Card>

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-amber-700">{stats.onLeave}</div>
              <div className="text-sm text-amber-600 font-medium mt-1">On Leave</div>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-blue-700">{stats.academic}</div>
              <div className="text-sm text-blue-600 font-medium mt-1">Academic Staff</div>
            </CardContent>
          </Card>

          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="text-3xl font-bold text-purple-700">{stats.total}</div>
              <div className="text-sm text-purple-600 font-medium mt-1">Total Staff</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search staff members..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Departments</SelectItem>
              <SelectItem value="academic">Academic</SelectItem>
              <SelectItem value="non-academic">Non-Academic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Staff Members List */}
        <div className="space-y-4">
          {filteredStaff.map((staff) => (
            <Card key={staff.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <Avatar className="h-12 w-12 bg-slate-700">
                      <AvatarFallback className="bg-slate-700 text-white font-semibold">
                        {getInitials(staff.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-900">{staff.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{staff.role}</p>
                      
                      <div className="flex flex-wrap gap-2 mb-3">
                        <Badge variant="secondary" className="bg-teal-50 text-teal-700 border-teal-200">
                          {staff.position}
                        </Badge>
                        <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                          {staff.scale}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Mail className="h-3 w-3" />
                          <span>{staff.email}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          <span>{staff.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Button
                      onClick={() => handleEditGrade(staff.name)}
                      className="bg-blue-600 hover:bg-blue-700"
                    >
                      Edit Grade/Salary
                    </Button>

                    <div className="flex flex-col items-end gap-2 min-w-[120px]">
                      <Badge 
                        className={
                          staff.status === "Active" 
                            ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-100" 
                            : "bg-amber-100 text-amber-700 hover:bg-amber-100"
                        }
                      >
                        {staff.status}
                      </Badge>
                      <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-200">
                        {staff.category}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Hired: {staff.hiredDate}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default StaffAdmin;
