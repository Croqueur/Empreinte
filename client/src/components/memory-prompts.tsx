import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateMemoryDialog from "./create-memory-dialog";

type MemoryPromptsProps = {
  categoryId: number;
  questions: string[];
};

export default function MemoryPrompts({ categoryId, questions }: MemoryPromptsProps) {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // Function to generate a title from the prompt
  const generateTitleFromPrompt = (prompt: string): string => {
    // Remove question marks and "what is/are" phrases
    const cleanPrompt = prompt
      .replace(/\?/g, '')
      .replace(/what (is|are) (your|the) /i, '')
      .trim();

    // Capitalize first letter of each word
    return cleanPrompt
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {questions.map((question, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <p className="text-lg mb-4">{question}</p>
            <Button 
              onClick={() => {
                setSelectedPrompt(question);
                setIsCreateOpen(true);
              }}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Memory
            </Button>
          </CardContent>
        </Card>
      ))}

      <CreateMemoryDialog
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
        categoryId={categoryId}
        promptText={selectedPrompt}
        suggestedTitle={selectedPrompt ? generateTitleFromPrompt(selectedPrompt) : undefined}
      />
    </div>
  );
}