import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { categories, type Memory } from "@shared/schema";
import MemoryCard from "@/components/memory-card";
import { memoryPrompts } from "@/lib/memory-prompts";
import MemoryPrompts from "@/components/memory-prompts";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";

export default function MemoryPage() {
  const [, params] = useRoute<{ id: string }>("/category/:id");
  const categoryId = params?.id ? parseInt(params.id) : 0;
  const category = categories.find(c => c.id === categoryId);

  const { data: memories = [] } = useQuery<Memory[]>({
    queryKey: ["/api/memories", categoryId],
  });

  if (!category) {
    return <div>Category not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div 
        className="h-64 bg-cover bg-center flex items-center relative"
        style={{ backgroundImage: `url(${category.coverUrl})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
        <div className="container mx-auto px-4 relative">
          <Link href="/">
            <Button variant="outline" size="sm" className="mb-4 bg-white/90 hover:bg-white">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-white drop-shadow-lg">
            {category.name}
          </h1>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-6">Memory Prompts</h2>
          <MemoryPrompts categoryId={categoryId} questions={memoryPrompts[categoryId] || []} />
        </div>

        {memories.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold mb-6">Your Memories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {memories.map((memory) => (
                <MemoryCard key={memory.id} memory={memory} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}