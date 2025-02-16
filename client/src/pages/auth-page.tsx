import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, type InsertUser } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function AuthPage() {
  const { user, loginMutation, registerMutation } = useAuth();
  const { t } = useLanguage();
  const [, setLocation] = useLocation();

  if (user) {
    setLocation("/");
    return null;
  }

  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex items-center justify-center">
        <Card className="w-[400px]">
          <CardHeader>
            <CardTitle>{t("welcome")}</CardTitle>
            <CardDescription>
              {t("description")}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="login">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t("login")}</TabsTrigger>
                <TabsTrigger value="register">{t("register")}</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      <div className="hidden lg:flex flex-1 bg-slate-100 items-center justify-center p-12">
        <div className="max-w-md space-y-4">
          <h2 className="text-3xl font-bold">Your Life Story, Your Way</h2>
          <p className="text-lg text-gray-600">
            Create meaningful memories across 12 different life categories, from childhood memories to future aspirations.
          </p>
        </div>
      </div>
    </div>
  );
}

function LoginForm() {
  const { loginMutation } = useAuth();
  const { t } = useLanguage();
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema.pick({ username: true, password: true })),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => loginMutation.mutate(data))} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">{t("username")}</Label>
          <Input id="username" {...form.register("username")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" {...form.register("password")} />
        </div>
        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {t("login")}
        </Button>
        <p className="text-sm text-center text-muted-foreground mt-4">
          {t("noAccount")}{" "}
          <button
            type="button"
            onClick={() => document.querySelector('[data-value="register"]')?.click()}
            className="text-primary hover:underline font-medium"
          >
            {t("registerHere")}
          </button>
        </p>
      </form>
    </Form>
  );
}

function RegisterForm() {
  const { registerMutation } = useAuth();
  const { t } = useLanguage();
  const form = useForm<InsertUser>({
    resolver: zodResolver(insertUserSchema),
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => registerMutation.mutate(data))} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="username">{t("username")}</Label>
          <Input id="username" {...form.register("username")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fullName">{t("fullName")}</Label>
          <Input id="fullName" {...form.register("fullName")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">{t("dateOfBirth")}</Label>
          <Input id="dateOfBirth" type="date" {...form.register("dateOfBirth")} />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">{t("password")}</Label>
          <Input id="password" type="password" {...form.register("password")} />
        </div>
        <Button type="submit" className="w-full" disabled={registerMutation.isPending}>
          {registerMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {t("register")}
        </Button>
      </form>
    </Form>
  );
}