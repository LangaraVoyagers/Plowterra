import React, { createContext, useContext } from "react";
import { IntlProvider } from "react-intl";
import English from "../../compiled-lang/en.json";
import Spanish from "../../compiled-lang/es.json";
import { usePersistedState } from "hooks/usePersistedState";

const messages = {
  en: English,
  es: Spanish,
};

export enum LANGUAGES {
  "en" = "en",
  "es" = "es",
}

export const LocaleContext = createContext<{
  locale: `${LANGUAGES}`;
  selectLanguage: (locale: `${LANGUAGES}`) => Promise<void>;
} | null>(null);

type LocaleProviderProps = {
  children: React.ReactNode;
};

export const LocaleProvider: React.FC<LocaleProviderProps> = ({ children }) => {
  const [locale, setLocale] = usePersistedState<`${LANGUAGES}`>("lang", "en");

  const selectLanguage = async (language: `${LANGUAGES}`) => {
    setLocale(language);
  };

  return (
    <LocaleContext.Provider
      value={{
        locale,
        selectLanguage,
      }}
    >
      <IntlProvider
        messages={messages[locale]}
        locale={locale}
        defaultLocale="en"
      >
        {children}
      </IntlProvider>
    </LocaleContext.Provider>
  );
};

export const useLocale = () => {
  const context = useContext(LocaleContext);

  if (context === null) {
    throw new Error("LocaleContext must be used within a LocaleProvider");
  }

  return context;
};
