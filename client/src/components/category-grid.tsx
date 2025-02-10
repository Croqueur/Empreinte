import { categories } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <Link key={category.id} href={`/category/${category.id}`}>
          <Card className="cursor-pointer hover:shadow-lg transition-shadow">
            <div
              className="h-48 bg-cover bg-center rounded-t-lg"
              style={{ backgroundImage: `url(${category.coverUrl})` }}
            />
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{category.name}</h3>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
