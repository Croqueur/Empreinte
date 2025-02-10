import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, UserCircle, Users } from "lucide-react";
import { useState } from "react";

type FamilyMember = {
  id: number;
  name: string;
  relationship: string;
  level: number; // Generation level (0 for self, 1 for parents, -1 for children)
  position: number; // Horizontal position in the level
};

export default function FamilyTreeTab() {
  // Mock data for now - will be replaced with API calls
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([
    { id: 1, name: "You", relationship: "Self", level: 0, position: 0 },
    { id: 2, name: "John Doe", relationship: "Father", level: 1, position: -1 },
    { id: 3, name: "Jane Doe", relationship: "Mother", level: 1, position: 1 },
    { id: 4, name: "Mike Doe", relationship: "Brother", level: 0, position: 1 },
  ]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">My Family Tree</h2>
        <Button variant="outline">
          <Plus className="h-4 w-4 mr-2" />
          Add Family Member
        </Button>
      </div>

      <div className="relative min-h-[500px] border rounded-lg p-8 bg-slate-50">
        {/* Parents Level */}
        <div className="absolute top-8 left-0 right-0">
          <div className="flex justify-center gap-16">
            {familyMembers
              .filter((member) => member.level === 1)
              .map((member) => (
                <Card key={member.id} className="w-48">
                  <CardContent className="p-4 text-center">
                    <UserCircle className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.relationship}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Self Level */}
        <div className="absolute top-48 left-0 right-0">
          <div className="flex justify-center gap-16">
            {familyMembers
              .filter((member) => member.level === 0)
              .map((member) => (
                <Card key={member.id} className="w-48">
                  <CardContent className="p-4 text-center">
                    <UserCircle className="h-12 w-12 mx-auto mb-2" />
                    <p className="font-semibold">{member.name}</p>
                    <p className="text-sm text-gray-500">{member.relationship}</p>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>

        {/* Connection Lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 0 }}
        >
          {/* Vertical line from parents */}
          <line
            x1="50%"
            y1="104"
            x2="50%"
            y2="192"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          {/* Horizontal line between parents */}
          <line
            x1="calc(50% - 96px)"
            y1="72"
            x2="calc(50% + 96px)"
            y2="72"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          {/* Vertical lines to parents */}
          <line
            x1="calc(50% - 96px)"
            y1="72"
            x2="calc(50% - 96px)"
            y2="104"
            stroke="#94a3b8"
            strokeWidth="2"
          />
          <line
            x1="calc(50% + 96px)"
            y1="72"
            x2="calc(50% + 96px)"
            y2="104"
            stroke="#94a3b8"
            strokeWidth="2"
          />
        </svg>
      </div>
    </div>
  );
}
