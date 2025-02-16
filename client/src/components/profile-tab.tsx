import DailyMemory from "./daily-memory";
import CreateOwnMemory from "./create-own-memory";
import CategoryGrid from "./category-grid";
import { useAuth } from "@/hooks/use-auth";

export default function ProfileTab() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <DailyMemory />
      <CreateOwnMemory />
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Pre-filled Memory Categories</h2>
        <p className="text-muted-foreground">
          Explore different aspects of your life through our guided memory categories.
        </p>
        <CategoryGrid />
      </div>
    </div>
  );
}