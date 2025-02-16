import { categories } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { Progress } from "@/components/ui/progress";
import { useQuery } from "@tanstack/react-query";

type CategoryProgress = {
  answered: number;
  total: number;
};

export default function CategoryGrid() {
  const categoryProgressQueries = categories.map(category => {
    return useQuery<CategoryProgress>({
      queryKey: ["/api/categories", category.id, "progress"],
      queryFn: async () => {
        const res = await fetch(`/api/categories/${category.id}/progress`);
        return res.json();
      },
    });
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category, index) => {
        const progress = categoryProgressQueries[index].data;
        const progressPercentage = progress && progress.total > 0 
          ? Math.round((progress.answered / progress.total) * 100)
          : 0;

        return (
          <Link key={category.id} href={`/category/${category.id}`}>
            <Card className="cursor-pointer hover:shadow-lg transition-shadow">
              <div
                className="h-48 bg-cover bg-center rounded-t-lg"
                style={{ backgroundImage: `url(${category.coverUrl})` }}
              />
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-4">{category.name}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Progress value={progressPercentage} className="h-2 flex-grow" />
                    <span className="text-sm text-muted-foreground whitespace-nowrap">{progressPercentage}%</span>
                  </div>
                  <p className="text-sm text-muted-foreground text-center">
                    {progress ? (
                      <span>{progress.answered} Moments out of {progress.total} filled</span>
                    ) : (
                      <span className="text-gray-400">Loading...</span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}