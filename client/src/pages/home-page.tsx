import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProfileTab from "@/components/profile-tab";
import FeedTab from "@/components/feed-tab";
import CloseOnesTab from "@/components/close-ones-tab";
import { useLanguage } from "@/hooks/use-language";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Memento</h1>
          <div className="flex items-center gap-4">
            <span>{t("welcomeUser")}, {user?.username}</span>
            <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()}>
              <LogOut className="h-4 w-4 mr-2" />
              {t("logout")}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="profile" className="space-y-8">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="profile">{t("myProfile")}</TabsTrigger>
            <TabsTrigger value="feed">{t("myFeed")}</TabsTrigger>
            <TabsTrigger value="connections">{t("myCloseOnes")}</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <ProfileTab />
          </TabsContent>
          <TabsContent value="feed">
            <FeedTab />
          </TabsContent>
          <TabsContent value="connections">
            <CloseOnesTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}