import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";
import CreateMemoryDialog from "./create-memory-dialog";

export default function CreateOwnMemory() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Create Your Own Memory</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">
          Have a special memory you'd like to share? Create your own memory entry here.
        </p>
        <Button 
          onClick={() => setIsCreateOpen(true)}
          className="w-full sm:w-auto"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create New Memory
        </Button>
        
        <CreateMemoryDialog
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
          categoryId={1} // Default to first category
        />
      </CardContent>
    </Card>
  );
}
