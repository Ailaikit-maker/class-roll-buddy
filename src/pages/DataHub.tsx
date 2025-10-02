import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import Logo from "@/components/Logo";
import { Upload, FileText, Download, Search, Filter, Trash2, Folder, FolderOpen, Calendar } from "lucide-react";
import { format } from "date-fns";

const GRADES = ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12"];
const SUBJECTS = ["Mathematics", "English", "Science", "Social Studies", "Languages", "Arts", "Physical Education", "Technology", "Life Skills"];

const DataHub = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filterGrade, setFilterGrade] = useState<string>("all");
  const [filterSubject, setFilterSubject] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"folders" | "documents">("folders");
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    grade: "",
    subject: ""
  });

  const { data: documents, isLoading } = useQuery({
    queryKey: ["documents", filterGrade, filterSubject, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("documents")
        .select("*")
        .order("created_at", { ascending: false });

      if (filterGrade !== "all") {
        query = query.eq("grade", filterGrade);
      }
      if (filterSubject !== "all") {
        query = query.eq("subject", filterSubject);
      }
      if (searchQuery) {
        query = query.ilike("title", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: typeof formData & { file: File }) => {
      const { file, ...metadata } = data;
      
      // Upload file to storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from("documents")
        .getPublicUrl(filePath);

      // Create document record
      const { error: dbError } = await supabase
        .from("documents")
        .insert([{
          ...metadata,
          file_url: publicUrl,
          file_name: file.name,
          file_size: file.size,
          file_type: file.type
        }]);

      if (dbError) throw dbError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Document uploaded successfully" });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error uploading document", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (documentId: string) => {
      const { error } = await supabase
        .from("documents")
        .delete()
        .eq("id", documentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      toast({ title: "Document deleted successfully" });
    },
    onError: (error: Error) => {
      toast({ 
        title: "Error deleting document", 
        description: error.message, 
        variant: "destructive" 
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      grade: "",
      subject: ""
    });
    setSelectedFile(null);
  };

  const handleSubmit = () => {
    if (!selectedFile) {
      toast({ 
        title: "No file selected", 
        description: "Please select a file to upload",
        variant: "destructive" 
      });
      return;
    }
    uploadMutation.mutate({ ...formData, file: selectedFile });
  };

  const handleDownload = (fileUrl: string, fileName: string) => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.download = fileName;
    link.click();
  };

  const formatFileSize = (bytes: number | null) => {
    if (!bytes) return 'Unknown size';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / 1048576).toFixed(1) + ' MB';
  };

  // Group documents by subject and grade for folder view
  const folders = useMemo(() => {
    if (!documents) return [];
    
    const folderMap = new Map<string, {
      subject: string;
      grade: string;
      count: number;
      lastModified: Date;
    }>();

    documents.forEach(doc => {
      const key = `${doc.subject}-${doc.grade}`;
      const existing = folderMap.get(key);
      const docDate = new Date(doc.created_at);
      
      if (!existing) {
        folderMap.set(key, {
          subject: doc.subject,
          grade: doc.grade,
          count: 1,
          lastModified: docDate
        });
      } else {
        existing.count++;
        if (docDate > existing.lastModified) {
          existing.lastModified = docDate;
        }
      }
    });

    return Array.from(folderMap.values()).sort((a, b) => 
      a.subject.localeCompare(b.subject) || a.grade.localeCompare(b.grade)
    );
  }, [documents]);

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Logo className="h-14" />
            <div>
              <h1 className="text-3xl font-bold text-primary">Data Hub</h1>
              <p className="text-sm text-muted-foreground">Centralized document repository organized by grade and subject</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button 
              variant={viewMode === "folders" ? "default" : "outline"}
              onClick={() => setViewMode("folders")}
              className="gap-2"
            >
              <Folder className="h-4 w-4" />
              Folders
            </Button>
            <Button 
              variant={viewMode === "documents" ? "default" : "outline"}
              onClick={() => setViewMode("documents")}
              className="gap-2"
            >
              <FileText className="h-4 w-4" />
              All Documents
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="gap-2 bg-emerald-600 hover:bg-emerald-700">
                  <Upload className="h-4 w-4" />
                  Upload Document
                </Button>
              </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload New Document</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Title</label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Document title"
                    required
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Grade</label>
                    <Select value={formData.grade} onValueChange={(value) => setFormData({ ...formData, grade: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {GRADES.map((grade) => (
                          <SelectItem key={grade} value={grade}>
                            {grade}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Subject</label>
                    <Select value={formData.subject} onValueChange={(value) => setFormData({ ...formData, subject: value })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium">File</label>
                  <Input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt"
                  />
                  {selectedFile && (
                    <p className="text-sm text-muted-foreground mt-2">
                      Selected: {selectedFile.name} ({formatFileSize(selectedFile.size)})
                    </p>
                  )}
                </div>
                <Button onClick={handleSubmit} className="w-full" disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? "Uploading..." : "Upload Document"}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          </div>
        </div>

        {/* Filters */}
        <Card className="mb-6 border-0 shadow-sm bg-muted/30">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 mb-4">
              <Filter className="h-4 w-4 text-primary" />
              <h3 className="font-semibold text-foreground">Filters & Search</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search documents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterGrade} onValueChange={setFilterGrade}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Grades</SelectItem>
                  {GRADES.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterSubject} onValueChange={setFilterSubject}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Subjects</SelectItem>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Content Grid */}
        {isLoading ? (
          <p>Loading...</p>
        ) : viewMode === "folders" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {folders.length > 0 ? (
              folders.map((folder) => (
                <Card 
                  key={`${folder.subject}-${folder.grade}`} 
                  className="hover:shadow-md transition-shadow cursor-pointer border-muted"
                  onClick={() => {
                    setFilterSubject(folder.subject);
                    setFilterGrade(folder.grade);
                    setViewMode("documents");
                  }}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between mb-4">
                      <FolderOpen className="h-10 w-10 text-primary" />
                      <div className="text-right">
                        <p className="text-2xl font-semibold text-primary">{folder.count}</p>
                        <p className="text-xs text-muted-foreground">documents</p>
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-1">{folder.subject}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{folder.grade}</p>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      <span>Modified: {format(folder.lastModified, "dd/MM/yyyy")}</span>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No folders found</p>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents && documents.length > 0 ? (
              documents.map((doc) => (
                <Card key={doc.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg flex items-center gap-2">
                          <FileText className="h-5 w-5 text-primary" />
                          {doc.title}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                          {doc.description || "No description"}
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex gap-2">
                        <Badge variant="secondary">{doc.grade}</Badge>
                        <Badge variant="outline">{doc.subject}</Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>File: {doc.file_name}</p>
                        <p>Size: {formatFileSize(doc.file_size)}</p>
                        <p>Uploaded: {format(new Date(doc.created_at), "PP")}</p>
                      </div>
                      <div className="flex gap-2 pt-2">
                        <Button 
                          size="sm" 
                          variant="default"
                          className="flex-1"
                          onClick={() => handleDownload(doc.file_url, doc.file_name)}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (confirm("Are you sure you want to delete this document?")) {
                              deleteMutation.mutate(doc.id);
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchQuery || filterGrade !== "all" || filterSubject !== "all"
                    ? "No documents found matching your filters"
                    : "No documents yet. Upload your first document!"}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DataHub;
