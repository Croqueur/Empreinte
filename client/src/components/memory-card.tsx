import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { type Memory } from "@shared/schema";
import { Trash2 } from "lucide-react";
import { format } from "date-fns";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

type MemoryCardProps = {
  memory: Memory;
};

export default function MemoryCard({ memory }: MemoryCardProps) {
  const deleteMutation = useMutation({
    mutationFn: async () => {
      await apiRequest("DELETE", `/api/memories/${memory.id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories", memory.categoryId] });
    },
  });

  return (
    <Card>
      {memory.imageUrl && (
        <div
          className="h-48 bg-cover bg-center rounded-t-lg"
          style={{ backgroundImage: `url(${memory.imageUrl})` }}
        />
      )}
      <CardHeader className="flex flex-row justify-between items-start">
        <h3 className="font-semibold text-lg">{memory.title}</h3>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => deleteMutation.mutate()}
          disabled={deleteMutation.isPending}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-600 mb-2">
          {format(new Date(memory.createdAt), "PP")}
        </p>
        <p className="whitespace-pre-wrap">{memory.content}</p>
      </CardContent>
    </Card>
  );
}
