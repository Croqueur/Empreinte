import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CategoryGrid from "@/components/category-grid";
import FamilyTreeTab from "./family-tree-tab";
import { useAuth } from "@/hooks/use-auth";

export default function ProfileTab() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <Tabs defaultValue="categories" className="space-y-8">
        <TabsList>
          <TabsTrigger value="categories">Memory Categories</TabsTrigger>
          <TabsTrigger value="family-tree">Family Tree</TabsTrigger>
        </TabsList>
        <TabsContent value="categories">
          <h2 className="text-3xl font-bold mb-8">Your Memory Categories</h2>
          <CategoryGrid />
        </TabsContent>
        <TabsContent value="family-tree">
          <FamilyTreeTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}