import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertMemorySchema, type InsertMemory } from "@shared/schema";
import { useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";

type CreateMemoryDialogProps = {
  categoryId: number;
  promptText: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export default function CreateMemoryDialog({
  categoryId,
  promptText,
  open,
  onOpenChange,
}: CreateMemoryDialogProps) {
  const form = useForm<InsertMemory>({
    resolver: zodResolver(insertMemorySchema),
    defaultValues: {
      categoryId,
      title: "",
      content: "",
    },
  });

  // When the prompt changes, update the form's content
  useEffect(() => {
    if (promptText) {
      form.setValue("content", `Prompt: ${promptText}\n\nMy Memory:\n`);
    }
  }, [promptText, form]);

  const createMutation = useMutation({
    mutationFn: async (data: InsertMemory) => {
      const res = await apiRequest("POST", "/api/memories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories", categoryId] });
      onOpenChange(false);
      form.reset();
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Memory</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Memory Details</Label>
              <Textarea
                id="content"
                {...form.register("content")}
                rows={8}
                placeholder="Write your memory here..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL (optional)</Label>
              <Input id="imageUrl" {...form.register("imageUrl")} />
            </div>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Memory
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}