import { useQuery } from "@tanstack/react-query";
import { type Memory } from "@shared/schema";
import MemoryCard from "@/components/memory-card";

export default function FeedTab() {
  const { data: sharedMemories = [] } = useQuery<Memory[]>({
    queryKey: ["/api/memories/shared"],
  });

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Memory Feed</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sharedMemories.map((memory) => (
          <MemoryCard key={memory.id} memory={memory} showInteractions />
        ))}
      </div>
    </div>
  );
}
