import CategoryGrid from "@/components/category-grid";
import { useAuth } from "@/hooks/use-auth";

export default function ProfileTab() {
  const { user } = useAuth();

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold">Your Memory Categories</h2>
      <CategoryGrid />
    </div>
  );
}
