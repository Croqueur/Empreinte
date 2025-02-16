import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateMemoryDialog from "./create-memory-dialog";

const DAILY_QUESTIONS = [
  "Where were you on 9/11/2001?",
  "What was your first day of school like?",
  "What's your earliest childhood memory?",
  "What was your favorite family vacation?",
  "What was your first job?",
  "Who was your childhood best friend?",
  "What was your favorite toy growing up?",
  "What's a tradition your family had?",
  "What's the best advice you've ever received?",
  "What was your favorite subject in school?",
];

export default function DailyMemory() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  
  // Get a random question based on the current date
  const getTodayQuestion = () => {
    const today = new Date();
    const index = (today.getFullYear() * 365 + today.getMonth() * 31 + today.getDate()) % DAILY_QUESTIONS.length;
    return DAILY_QUESTIONS[index];
  };

  const dailyQuestion = getTodayQuestion();

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Today's Memory Question</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg mb-4">{dailyQuestion}</p>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Share This Memory
        </Button>
        
        <CreateMemoryDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          categoryId={1} // Default to first category
          promptText={dailyQuestion}
          suggestedTitle={dailyQuestion.replace(/\?/g, '')}
        />
      </CardContent>
    </Card>
  );
}
