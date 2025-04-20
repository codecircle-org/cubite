import { getRequestConfig } from "next-intl/server";
import { headers, cookies } from "next/headers";
import Negotiator from "negotiator";
import { match } from "@formatjs/intl-localematcher";
import { initializeTranslations } from "./utils/translate";

export default getRequestConfig(async () => {
  const headersList = Object.fromEntries(headers().entries());
  const cookieStore = cookies();

  // Check for language in cookie
  const cookieLanguage = cookieStore.get("selectedLanguage")?.value;

  const negotiator = new Negotiator({ headers: headersList });
  const languages = negotiator.languages();

  const locales = ["en", "en-US", "es-419", "pt-BR"] as const;
  const defaultLocale = "en-US";

  let locale: (typeof locales)[number];

  if (cookieLanguage && locales.includes(cookieLanguage as any)) {
    // Use cookie language if it's valid
    locale = cookieLanguage as (typeof locales)[number];
  } else {
    // Fall back to browser-negotiated language
    locale = match(
      languages,
      locales,
      defaultLocale
    ) as (typeof locales)[number];
  }

  await initializeTranslations(locale);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
