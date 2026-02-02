import "server-only";

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((mod) => mod.default),
  ch: () => import("./dictionaries/ch.json").then((mod) => mod.default),
};

export const getDictionary = async (locale: string) => {
  if (!Object.keys(dictionaries).includes(locale)) {
    locale = "en"; // fallback to default
  }

  return dictionaries[locale as "en" | "ch"]();
};
