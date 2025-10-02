import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Mail, MessageCircle, Send, Archive, Sparkles } from "lucide-react";

interface Message {
  id: string;
  title: string;
  recipient: string;
  preview: string;
  sentVia: "email" | "whatsapp";
  sentDate: string;
  read: boolean;
}

const ParentCommunication = () => {
  const { toast } = useToast();
  
  const [selectedParent, setSelectedParent] = useState("");
  const [subject, setSubject] = useState("");
  const [messageText, setMessageText] = useState("");
  const [channel, setChannel] = useState<"email" | "whatsapp">("email");
  const [aiPrompt, setAiPrompt] = useState("");
  const [isEnhancing, setIsEnhancing] = useState(false);

  const [messages] = useState<Message[]>([
    {
      id: "1",
      title: "Weekly Progress Update",
      recipient: "Mrs. Smith (John's mother)",
      preview: "John has shown excellent improvement in mathematics this week......",
      sentVia: "email",
      sentDate: "15/01/2025",
      read: true
    }
  ]);

  const parents = [
    { id: "1", name: "Mrs. Smith (John's mother)" },
    { id: "2", name: "Mr. Johnson (Emma's father)" },
    { id: "3", name: "Mrs. Garcia (Michael's mother)" }
  ];

  const handleEnhance = async () => {
    if (!messageText || !aiPrompt) {
      toast({
        title: "Missing Information",
        description: "Please enter both a message and enhancement instructions",
        variant: "destructive"
      });
      return;
    }

    setIsEnhancing(true);
    
    // Simulate AI enhancement - in production, this would call the Lovable AI API
    setTimeout(() => {
      // Mock enhancement
      setMessageText(messageText + "\n\n[AI Enhanced Message]");
      setIsEnhancing(false);
      setAiPrompt("");
      toast({
        title: "Message Enhanced",
        description: "Your message has been enhanced by AI"
      });
    }, 1500);
  };

  const handleSendMessage = () => {
    if (!selectedParent || !subject || !messageText) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Message Sent",
      description: `Message sent via ${channel} to ${parents.find(p => p.id === selectedParent)?.name}`
    });

    // Reset form
    setSelectedParent("");
    setSubject("");
    setMessageText("");
    setAiPrompt("");
  };

  const handleMessageArchive = () => {
    toast({
      title: "Message Archive",
      description: "Opening message archive..."
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Compose Message */}
          <div className="space-y-6">
            <Card className="bg-pink-50 border-pink-200">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="h-5 w-5 text-pink-700" />
                  <h3 className="font-semibold text-lg text-pink-900">Compose Message</h3>
                </div>

                <Select value={selectedParent} onValueChange={setSelectedParent}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Parent/Guardian" />
                  </SelectTrigger>
                  <SelectContent>
                    {parents.map((parent) => (
                      <SelectItem key={parent.id} value={parent.id}>
                        {parent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <div className="flex gap-2">
                  <Button
                    variant={channel === "email" ? "default" : "outline"}
                    onClick={() => setChannel("email")}
                    className={channel === "email" ? "bg-blue-600 hover:bg-blue-700" : ""}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button
                    variant={channel === "whatsapp" ? "default" : "outline"}
                    onClick={() => setChannel("whatsapp")}
                    className={channel === "whatsapp" ? "bg-green-600 hover:bg-green-700" : ""}
                  >
                    <MessageCircle className="mr-2 h-4 w-4" />
                    WhatsApp
                  </Button>
                </div>

                <Textarea
                  placeholder="Type your message here..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  rows={8}
                  className="resize-none"
                />
              </CardContent>
            </Card>

            {/* AI Message Assistant */}
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-5 w-5 text-purple-700" />
                  <h3 className="font-semibold text-purple-900">AI Message Assistant</h3>
                </div>
                
                <div className="flex gap-2">
                  <Input
                    placeholder="Ask AI to enhance your message (e.g., 'make it more encouraging')"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleEnhance}
                    disabled={isEnhancing}
                    className="bg-purple-600 hover:bg-purple-700"
                  >
                    {isEnhancing ? "Enhancing..." : "Enhance"}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Send Button */}
            <Button
              onClick={handleSendMessage}
              className="w-full bg-pink-600 hover:bg-pink-700 h-12 text-lg"
            >
              <Send className="mr-2 h-5 w-5" />
              Send Message
            </Button>
          </div>

          {/* Right Column - Message History */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold">Message History</h3>
              <Button
                onClick={handleMessageArchive}
                variant="outline"
                className="bg-slate-700 text-white hover:bg-slate-800 hover:text-white"
              >
                <Archive className="mr-2 h-4 w-4" />
                Message Archive
              </Button>
            </div>

            <div className="space-y-4">
              {messages.map((message) => (
                <Card key={message.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg mb-1">{message.title}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{message.recipient}</p>
                      </div>
                      {message.read && (
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                          Read
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-3">{message.preview}</p>
                    
                    <p className="text-xs text-muted-foreground">
                      Sent via {message.sentVia} on {message.sentDate}
                    </p>
                  </CardContent>
                </Card>
              ))}

              {messages.length === 0 && (
                <Card>
                  <CardContent className="p-6">
                    <p className="text-muted-foreground text-center">No messages sent yet</p>
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

export default ParentCommunication;
