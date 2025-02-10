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
import { Loader2, Mic, Square, ImagePlus } from "lucide-react";
import { useEffect, useState } from "react";
import { useReactMediaRecorder } from "react-media-recorder";

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
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const form = useForm<InsertMemory>({
    resolver: zodResolver(insertMemorySchema),
    defaultValues: {
      categoryId,
      title: "",
      content: "",
    },
  });

  const {
    status,
    startRecording,
    stopRecording,
    mediaBlobUrl,
  } = useReactMediaRecorder({ audio: true });

  // When the prompt changes, update the form's content
  useEffect(() => {
    if (promptText) {
      form.setValue("content", `Prompt: ${promptText}\n\nMy Memory:\n`);
    }
  }, [promptText, form]);

  // Handle typing detection
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    form.setValue("content", value);
    // Set typing status if content length is more than the prompt
    setIsTyping(value.length > (promptText ? promptText.length + 15 : 0));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        form.setValue("imageUrl", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const createMutation = useMutation({
    mutationFn: async (data: InsertMemory) => {
      const res = await apiRequest("POST", "/api/memories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories", categoryId] });
      onOpenChange(false);
      form.reset();
      setIsTyping(false);
      setSelectedImage(null);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>Create New Memory</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" {...form.register("title")} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="content">Memory Details</Label>
                <Textarea
                  id="content"
                  {...form.register("content")}
                  onChange={handleContentChange}
                  rows={8}
                  placeholder="Write your memory here..."
                  className="h-[200px]"
                />
              </div>
              {!isTyping && (
                <div className="flex flex-col items-center justify-center bg-slate-50 rounded-lg p-4">
                  {status === "recording" ? (
                    <Button
                      type="button"
                      variant="destructive"
                      size="lg"
                      className="w-32 h-32 rounded-full"
                      onClick={stopRecording}
                    >
                      <Square className="h-12 w-12" />
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      className="w-32 h-32 rounded-full"
                      onClick={startRecording}
                    >
                      <Mic className="h-12 w-12" />
                    </Button>
                  )}
                  <p className="mt-4 text-sm text-gray-600">
                    {status === "recording"
                      ? "Recording... Click to stop"
                      : "Click to start recording"}
                  </p>
                  {mediaBlobUrl && (
                    <audio className="mt-4" src={mediaBlobUrl} controls />
                  )}
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Memory Image</Label>
              <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-lg hover:bg-slate-50 transition-colors">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload}
                />
                <Label
                  htmlFor="image"
                  className="flex flex-col items-center cursor-pointer"
                >
                  <ImagePlus className="h-12 w-12 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-600">
                    Click to upload an image
                  </span>
                </Label>
                {selectedImage && (
                  <div className="mt-4 max-w-xs">
                    <img
                      src={selectedImage}
                      alt="Memory preview"
                      className="rounded-lg"
                    />
                  </div>
                )}
              </div>
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