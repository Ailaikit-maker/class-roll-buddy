import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Sparkles, Search, Calendar as CalendarIcon, Plus, Clock, ExternalLink, Video, FileText, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Planning = () => {
  const { toast } = useToast();
  const [lessonDescription, setLessonDescription] = useState("");
  const [resourceQuery, setResourceQuery] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  // Mock planning calendar data
  const weekDays = [
    { day: "Monday", date: "02/10/2025", lessons: 1 },
    { day: "Tuesday", date: "03/10/2025", lessons: 1 },
    { day: "Wednesday", date: "04/10/2025", lessons: 0 },
    { day: "Thursday", date: "05/10/2025", lessons: 0 },
    { day: "Friday", date: "06/10/2025", lessons: 0 },
  ];

  // Mock lesson plans
  const lessonPlans = [
    {
      id: 1,
      title: "Introduction to Fractions - Lesson & Assignment",
      subject: "Mathematics",
      hasAssignment: true,
      date: "20/01/2025",
      duration: "45 minutes",
      status: "Scheduled",
      objectives: [
        "Understand basic fraction concepts",
        "Identify numerator and denominator",
      ],
      rubric: [
        "Excellent (90-100%): Demonstrates complete understanding of fractions",
        "Good (80-89%): Shows good grasp with minor errors",
        "Satisfactory (70-79%): Basic understanding with some confusion",
        "Needs Improvement (60-69%): Limited understanding",
        "Unsatisfactory (0-59%): Little to no understanding",
      ],
      resources: {
        videos: [
          { title: "Khan Academy: Introduction to Fractions", url: "#" },
          { title: "Math Antics: What are Fractions?", url: "#" },
        ],
        articles: [
          { title: "Understanding Fractions - Education.com", url: "#" },
          { title: "Fraction Basics for Elementary Students", url: "#" },
        ],
        websites: [
          { title: "IXL Math - Fractions Practice", url: "#" },
          { title: "Coolmathkids - Fractions Games", url: "#" },
        ],
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Lesson & Assignment Planner with AI Assistant
            </h1>
            <p className="text-muted-foreground mt-1">
              Create and manage lesson plans and assignments with AI assistance and web resource discovery
            </p>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "w-[200px] justify-start text-left font-normal",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {selectedDate ? format(selectedDate, "yyyy/MM/dd") : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                initialFocus
                className={cn("p-3 pointer-events-auto")}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-6">
          {/* AI Lesson & Assignment Planner */}
          <Card className="bg-purple-50 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="h-5 w-5 text-purple-600" />
                <h2 className="text-xl font-semibold text-purple-900">
                  AI Lesson & Assignment Planner
                </h2>
              </div>

              <Textarea
                placeholder="Describe what you want to teach (e.g., 'Create a lesson and assignment about photosynthesis for Grade 7 students with rubric')..."
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                className="min-h-[100px] bg-white mb-4"
              />

              <Button
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => toast({ title: "Generating lesson plan...", description: "AI is creating your lesson plan." })}
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate Lesson & Assignment Plan
              </Button>
            </CardContent>
          </Card>

          {/* AI Web Resource Discovery */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Search className="h-5 w-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-blue-900">
                  AI Web Resource Discovery
                </h2>
              </div>

              <div className="flex gap-2 mb-2">
                <Input
                  placeholder="Search for additional resources (e.g., 'fractions videos for grade 5')..."
                  value={resourceQuery}
                  onChange={(e) => setResourceQuery(e.target.value)}
                  className="bg-white"
                />
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white whitespace-nowrap"
                  onClick={() => toast({ title: "Finding resources...", description: "AI is searching for relevant resources." })}
                >
                  <Search className="h-4 w-4 mr-2" />
                  Find Resources
                </Button>
              </div>

              <p className="text-sm text-blue-700">
                AI will search the web for videos, articles, and interactive resources related to your topic.
              </p>
            </CardContent>
          </Card>

          {/* Main Content Area */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Planning Calendar */}
            <Card className="lg:col-span-1">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CalendarIcon className="h-5 w-5" />
                  <h2 className="font-semibold">Planning Calendar</h2>
                </div>

                <div className="space-y-3">
                  {weekDays.map((day, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded border hover:bg-accent cursor-pointer transition-colors"
                    >
                      <div className="font-medium">{day.day}</div>
                      <div className="text-xs text-muted-foreground">{day.date}</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        {day.lessons} {day.lessons === 1 ? "lesson" : "lessons"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Lesson Plans */}
            <div className="lg:col-span-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Lesson Plans</h2>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  New Plan
                </Button>
              </div>

              <div className="space-y-4">
                {lessonPlans.map((plan) => (
                  <Card key={plan.id}>
                    <CardContent className="p-6">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold mb-2">{plan.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm text-muted-foreground">{plan.subject}</span>
                            {plan.hasAssignment && (
                              <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">
                                Includes Assignment
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <CalendarIcon className="h-4 w-4" />
                              {plan.date}
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-4 w-4" />
                              {plan.duration}
                            </div>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">
                          {plan.status}
                        </Badge>
                      </div>

                      {/* Objectives */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Objectives:</h4>
                        <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                          {plan.objectives.map((obj, idx) => (
                            <li key={idx}>{obj}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Assessment Rubric */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Assessment Rubric:</h4>
                        <div className="bg-muted/50 p-3 rounded space-y-1">
                          {plan.rubric.map((item, idx) => (
                            <p key={idx} className="text-sm text-muted-foreground">
                              {item}
                            </p>
                          ))}
                        </div>
                      </div>

                      {/* Additional Resources */}
                      <div>
                        <h4 className="font-semibold mb-3">Additional Resources:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {/* Videos */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Video className="h-4 w-4 text-red-600" />
                              <span className="text-sm font-medium text-red-600">Videos</span>
                            </div>
                            <div className="space-y-1">
                              {plan.resources.videos.map((video, idx) => (
                                <a
                                  key={idx}
                                  href={video.url}
                                  className="flex items-start gap-1 text-sm text-blue-600 hover:underline"
                                >
                                  <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  <span>{video.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* Articles */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <FileText className="h-4 w-4 text-emerald-600" />
                              <span className="text-sm font-medium text-emerald-600">Articles</span>
                            </div>
                            <div className="space-y-1">
                              {plan.resources.articles.map((article, idx) => (
                                <a
                                  key={idx}
                                  href={article.url}
                                  className="flex items-start gap-1 text-sm text-blue-600 hover:underline"
                                >
                                  <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  <span>{article.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>

                          {/* Websites */}
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <Globe className="h-4 w-4 text-purple-600" />
                              <span className="text-sm font-medium text-purple-600">Websites</span>
                            </div>
                            <div className="space-y-1">
                              {plan.resources.websites.map((website, idx) => (
                                <a
                                  key={idx}
                                  href={website.url}
                                  className="flex items-start gap-1 text-sm text-blue-600 hover:underline"
                                >
                                  <ExternalLink className="h-3 w-3 mt-0.5 flex-shrink-0" />
                                  <span>{website.title}</span>
                                </a>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Planning;
