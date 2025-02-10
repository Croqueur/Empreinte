import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UserCircle, Link } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { FamilyMember, InsertFamilyMember } from "@shared/schema";
import { Command, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";

const addMemberSchema = z.object({
  name: z.string().min(1, "Name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

type AddMemberForm = z.infer<typeof addMemberSchema>;

type PlatformUser = {
  id: number;
  username: string;
  fullName: string;
};

export default function FamilyTreeTab() {
  const [draggedMember, setDraggedMember] = useState<FamilyMember | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAddingMember, setIsAddingMember] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedMember, setSelectedMember] = useState<FamilyMember | null>(null);
  const [isLinking, setIsLinking] = useState(false);
  const { toast } = useToast();

  const form = useForm<AddMemberForm>({
    resolver: zodResolver(addMemberSchema),
  });

  // Query family members
  const { data: familyMembers = [] } = useQuery<FamilyMember[]>({
    queryKey: ["/api/family-members"],
  });

  // Search platform users
  const { data: searchResults = [] } = useQuery<PlatformUser[]>({
    queryKey: ["/api/users/search", searchValue],
    enabled: isLinking && searchValue.length > 0,
  });

  const createMemberMutation = useMutation({
    mutationFn: async (data: InsertFamilyMember) => {
      const res = await apiRequest("POST", "/api/family-members", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/family-members"] });
      setIsAddingMember(false);
      form.reset();
      toast({
        title: "Success",
        description: "Family member added successfully",
      });
    },
  });

  const linkMemberMutation = useMutation({
    mutationFn: async ({ memberId, platformUserId }: { memberId: number; platformUserId: number }) => {
      await apiRequest("POST", `/api/family-members/${memberId}/link`, { platformUserId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/family-members"] });
      setIsLinking(false);
      setSelectedMember(null);
      toast({
        title: "Success",
        description: "Family member linked to platform user",
      });
    },
  });

  const updatePositionMutation = useMutation({
    mutationFn: async ({ id, x, y }: { id: number; x: number; y: number }) => {
      await apiRequest("PATCH", `/api/family-members/${id}/position`, { x, y });
    },
  });

  const handleDragStart = (member: FamilyMember) => {
    setDraggedMember(member);
    setIsDragging(true);
  };

  const handleDrag = (e: React.DragEvent, member: FamilyMember) => {
    if (!isDragging || !draggedMember) return;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const x = Math.round(e.clientX - rect.left);
    const y = Math.round(e.clientY - rect.top);

    updatePositionMutation.mutate({ id: member.id, x, y });
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDraggedMember(null);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">My Family Tree</h2>
        <Button onClick={() => setIsAddingMember(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Family Member
        </Button>
      </div>

      <div 
        className="relative min-h-[600px] border rounded-lg p-8 bg-slate-50"
        onDragOver={(e) => e.preventDefault()}
      >
        {familyMembers.map((member) => (
          <div
            key={member.id}
            className="absolute"
            style={{
              left: member.x,
              top: member.y,
              cursor: 'move'
            }}
            draggable
            onDragStart={() => handleDragStart(member)}
            onDrag={(e) => handleDrag(e, member)}
            onDragEnd={handleDragEnd}
          >
            <Card className="w-48">
              <CardContent className="p-4 text-center">
                <UserCircle className="h-12 w-12 mx-auto mb-2" />
                <p className="font-semibold">{member.name}</p>
                <p className="text-sm text-gray-500">
                  {new Date(member.dateOfBirth).toLocaleDateString()}
                </p>
                {member.platformUserId ? (
                  <p className="text-sm text-blue-500 mt-2">Linked to platform user</p>
                ) : (
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      setSelectedMember(member);
                      setIsLinking(true);
                    }}
                  >
                    <Link className="h-4 w-4 mr-2" />
                    Link to User
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        ))}

        <svg className="absolute inset-0 pointer-events-none">
          {familyMembers.map((member, i) => 
            familyMembers.slice(i + 1).map((otherMember, j) => (
              <line
                key={`${member.id}-${otherMember.id}`}
                x1={member.x + 96}
                y1={member.y}
                x2={otherMember.x + 96}
                y2={otherMember.y}
                stroke="#94a3b8"
                strokeWidth="2"
                strokeDasharray="4"
              />
            ))
          )}
        </svg>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={isAddingMember} onOpenChange={setIsAddingMember}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Family Member</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit((data) => createMemberMutation.mutate(data))} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" {...form.register("name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input 
                  id="dateOfBirth" 
                  type="date" 
                  {...form.register("dateOfBirth")} 
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsAddingMember(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Add Member</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Link to User Dialog */}
      <Dialog open={isLinking} onOpenChange={setIsLinking}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Link to Platform User</DialogTitle>
          </DialogHeader>
          <Command>
            <CommandInput
              placeholder="Search users..."
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandGroup>
              {searchResults.map((user) => (
                <CommandItem
                  key={user.id}
                  value={user.username}
                  onSelect={() => {
                    if (selectedMember) {
                      linkMemberMutation.mutate({
                        memberId: selectedMember.id,
                        platformUserId: user.id,
                      });
                    }
                  }}
                >
                  <div>
                    <p>{user.fullName}</p>
                    <p className="text-sm text-gray-500">@{user.username}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </DialogContent>
      </Dialog>
    </div>
  );
}