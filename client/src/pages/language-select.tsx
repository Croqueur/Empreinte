import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/use-language";
import { useLocation } from "wouter";
import { Globe2 } from "lucide-react";

export default function LanguageSelect() {
  const { t, setLanguage } = useLanguage();
  const [, setLocation] = useLocation();

  const handleLanguageSelect = (lang: "en" | "fr") => {
    setLanguage(lang);
    setLocation("/auth");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <Globe2 className="w-12 h-12 mx-auto mb-4 text-primary" />
          <CardTitle>{t("chooseLanguage")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            variant="outline"
            className="w-full h-12 text-lg"
            onClick={() => handleLanguageSelect("en")}
          >
            {t("english")}
          </Button>
          <Button
            variant="outline"
            className="w-full h-12 text-lg"
            onClick={() => handleLanguageSelect("fr")}
          >
            {t("french")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
