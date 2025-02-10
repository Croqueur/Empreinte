import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Search, UserPlus, Users } from "lucide-react";
import { useState } from "react";

type Connection = {
  id: number;
  username: string;
  fullName: string;
  relationship: string;
};

export default function CloseOnesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Connection[]>([]);

  // Mock data for now - will be replaced with actual API calls
  const myConnections: Connection[] = [
    { id: 1, username: "mom123", fullName: "Jane Doe", relationship: "Mother" },
    { id: 2, username: "bro456", fullName: "John Smith", relationship: "Brother" },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Mock search results - will be replaced with API call
    if (query.length > 0) {
      setSearchResults([
        { id: 3, username: "sis789", fullName: "Mary Johnson", relationship: "Friend" },
        { id: 4, username: "uncle42", fullName: "Bob Wilson", relationship: "Uncle" },
      ]);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-6">My Close Ones</h2>
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            className="pl-10"
            placeholder="Search for family and friends..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
          />
        </div>
      </div>

      {searchQuery && searchResults.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-4">Search Results</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchResults.map((result) => (
              <Card key={result.id}>
                <CardContent className="p-4 flex justify-between items-center">
                  <div>
                    <p className="font-semibold">{result.fullName}</p>
                    <p className="text-sm text-gray-600">@{result.username}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <UserPlus className="h-4 w-4 mr-2" />
                    Connect
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-4">
          <Users className="h-5 w-5" />
          <h3 className="text-lg font-semibold">My Connections</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myConnections.map((connection) => (
            <Card key={connection.id}>
              <CardContent className="p-4">
                <p className="font-semibold">{connection.fullName}</p>
                <p className="text-sm text-gray-600">@{connection.username}</p>
                <p className="text-sm text-gray-500 mt-1">{connection.relationship}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
