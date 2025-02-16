import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { LogOut } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import ProfileTab from "@/components/profile-tab";
import FeedTab from "@/components/feed-tab";
import CloseOnesTab from "@/components/close-ones-tab";
import { useLanguage } from "@/hooks/use-language";
import { useState } from "react";

export default function HomePage() {
  const { user, logoutMutation } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold">Memento</h1>
            <div className="flex items-center gap-4">
              <span>{t("welcomeUser")}, {user?.username}</span>
              <Button variant="outline" size="sm" onClick={() => logoutMutation.mutate()}>
                <LogOut className="h-4 w-4 mr-2" />
                {t("logout")}
              </Button>
            </div>
          </div>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  {activeTab === "profile" && t("myProfile")}
                  {activeTab === "feed" && t("myFeed")}
                  {activeTab === "connections" && t("myCloseOnes")}
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-4 w-[400px]">
                    <NavigationMenuLink
                      className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      onClick={() => setActiveTab("profile")}
                    >
                      <div className="text-sm font-medium leading-none">{t("myProfile")}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        View and manage your memory categories and family tree
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      onClick={() => setActiveTab("feed")}
                    >
                      <div className="text-sm font-medium leading-none">{t("myFeed")}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Browse shared memories from your connections
                      </p>
                    </NavigationMenuLink>
                    <NavigationMenuLink
                      className="cursor-pointer block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      onClick={() => setActiveTab("connections")}
                    >
                      <div className="text-sm font-medium leading-none">{t("myCloseOnes")}</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Manage your family and friend connections
                      </p>
                    </NavigationMenuLink>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {activeTab === "profile" && <ProfileTab />}
        {activeTab === "feed" && <FeedTab />}
        {activeTab === "connections" && <CloseOnesTab />}
      </main>
    </div>
  );
}