import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { categories, type Memory } from "@shared/schema";
import { Button } from "@/components/ui/button";
import MemoryCard from "@/components/memory-card";
import CreateMemoryDialog from "@/components/create-memory-dialog";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function MemoryPage() {
  const { id } = useParams();
  const categoryId = parseInt(id);
  const category = categories.find(c => c.id === categoryId);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const { data: memories = [] } = useQuery<Memory[]>({
    queryKey: ["/api/memories", categoryId],
  });

  if (!category) return null;

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="h-64 bg-cover bg-center flex items-center"
        style={{ backgroundImage: `url(${category.coverUrl})` }}
      >
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            {category.name}
          </h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-semibold">Your Memories</h2>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Create Memory
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {memories.map((memory) => (
            <MemoryCard key={memory.id} memory={memory} />
          ))}
        </div>

        <CreateMemoryDialog
          category={category}
          open={isCreateOpen}
          onOpenChange={setIsCreateOpen}
        />
      </main>
    </div>
  );
}
