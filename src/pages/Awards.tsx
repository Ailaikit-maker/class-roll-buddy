import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Plus, Edit, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

const Awards = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAward, setEditingAward] = useState<any>(null);
  const [formData, setFormData] = useState({
    child_id: "",
    award_name: "",
    award_type: "",
    description: "",
    date_received: "",
    awarded_by: "",
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

  const { data: awards, isLoading } = useQuery({
    queryKey: ["all-awards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("awards")
        .select(`
          *,
          children (
            name,
            grade
          )
        `)
        .order("date_received", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const { error } = await supabase
        .from("awards")
        .insert([data]);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-awards"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast({ title: "Award created successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error creating award", description: error.message, variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const { error } = await supabase
        .from("awards")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-awards"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast({ title: "Award updated successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error) => {
      toast({ title: "Error updating award", description: error.message, variant: "destructive" });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("awards")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-awards"] });
      queryClient.invalidateQueries({ queryKey: ["awards"] });
      toast({ title: "Award deleted successfully" });
    },
    onError: (error) => {
      toast({ title: "Error deleting award", description: error.message, variant: "destructive" });
    },
  });

  const resetForm = () => {
    setFormData({
      child_id: "",
      award_name: "",
      award_type: "",
      description: "",
      date_received: "",
      awarded_by: "",
    });
    setEditingAward(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAward) {
      updateMutation.mutate({ id: editingAward.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (award: any) => {
    setEditingAward(award);
    setFormData({
      child_id: award.child_id,
      award_name: award.award_name,
      award_type: award.award_type,
      description: award.description || "",
      date_received: award.date_received,
      awarded_by: award.awarded_by || "",
    });
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-primary">Awards & Achievements</h1>
          <Dialog open={isDialogOpen} onOpenChange={(open) => {
            setIsDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Award
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>{editingAward ? "Edit Award" : "Add New Award"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="child_id">Learner</Label>
                  <Select
                    value={formData.child_id}
                    onValueChange={(value) => setFormData({ ...formData, child_id: value })}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select learner" />
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
                <div>
                  <Label htmlFor="award_name">Award Name</Label>
                  <Input
                    id="award_name"
                    value={formData.award_name}
                    onChange={(e) => setFormData({ ...formData, award_name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="award_type">Award Type</Label>
                  <Input
                    id="award_type"
                    value={formData.award_type}
                    onChange={(e) => setFormData({ ...formData, award_type: e.target.value })}
                    placeholder="e.g., Academic, Sports, Arts"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="date_received">Date Received</Label>
                  <Input
                    id="date_received"
                    type="date"
                    value={formData.date_received}
                    onChange={(e) => setFormData({ ...formData, date_received: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="awarded_by">Awarded By</Label>
                  <Input
                    id="awarded_by"
                    value={formData.awarded_by}
                    onChange={(e) => setFormData({ ...formData, awarded_by: e.target.value })}
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">
                    {editingAward ? "Update" : "Create"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <p>Loading awards...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {awards && awards.length > 0 ? (
              awards.map((award) => (
                <Card key={award.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Trophy className="h-6 w-6 text-yellow-500 mt-1" />
                        <div>
                          <CardTitle className="text-xl">{award.award_name}</CardTitle>
                          <p className="text-sm text-muted-foreground mt-1">
                            {award.children.name} - Grade {award.children.grade}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => handleEdit(award)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this award?")) {
                              deleteMutation.mutate(award.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="text-sm">
                        <strong>Type:</strong> {award.award_type}
                      </div>
                      <div className="text-sm">
                        <strong>Date:</strong> {format(new Date(award.date_received), "PPP")}
                      </div>
                      {award.description && (
                        <p className="text-sm text-muted-foreground">{award.description}</p>
                      )}
                      {award.awarded_by && (
                        <div className="text-sm">
                          <strong>Awarded by:</strong> {award.awarded_by}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <Card className="col-span-full">
                <CardContent className="text-center py-8">
                  <p className="text-muted-foreground">No awards found. Create your first award!</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Awards;