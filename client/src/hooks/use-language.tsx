import { createContext, ReactNode, useContext, useState } from "react";

type Language = "en" | "fr";

type LanguageContextType = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof typeof translations) => string;
};

export const translations = {
  welcome: {
    en: "Welcome to Memento",
    fr: "Bienvenue sur Memento"
  },
  description: {
    en: "Preserve and share your life's most precious memories",
    fr: "Préservez et partagez les souvenirs les plus précieux de votre vie"
  },
  login: {
    en: "Login",
    fr: "Connexion"
  },
  register: {
    en: "Register",
    fr: "S'inscrire"
  },
  username: {
    en: "Username",
    fr: "Nom d'utilisateur"
  },
  password: {
    en: "Password",
    fr: "Mot de passe"
  },
  fullName: {
    en: "Full Name",
    fr: "Nom complet"
  },
  dateOfBirth: {
    en: "Date of Birth",
    fr: "Date de naissance"
  },
  noAccount: {
    en: "Don't have an account?",
    fr: "Vous n'avez pas de compte ?"
  },
  registerHere: {
    en: "Register here",
    fr: "Inscrivez-vous ici"
  },
  chooseLanguage: {
    en: "Choose your language",
    fr: "Choisissez votre langue"
  },
  continue: {
    en: "Continue",
    fr: "Continuer"
  },
  english: {
    en: "English",
    fr: "Anglais"
  },
  french: {
    en: "French",
    fr: "Français"
  }
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  const t = (key: keyof typeof translations) => {
    return translations[key][language];
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
