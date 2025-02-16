import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "./hooks/use-auth";
import { LanguageProvider, useLanguage } from "./hooks/use-language";
import NotFound from "./pages/not-found";
import AuthPage from "./pages/auth-page";
import HomePage from "./pages/home-page";
import MemoryPage from "./pages/memory-page";
import LanguageSelect from "./pages/language-select";
import { ProtectedRoute } from "./lib/protected-route";

function Router() {
  const { language } = useLanguage();

  return (
    <Switch>
      <Route path="/">
        {() => {
          // Redirect to language selection if no language is set
          if (!language) {
            return <Redirect to="/language" />;
          }
          return <HomePage />;
        }}
      </Route>
      <Route path="/language" component={LanguageSelect} />
      <Route path="/auth" component={AuthPage} />
      <ProtectedRoute path="/category/:id" component={MemoryPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <Router />
          <Toaster />
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;