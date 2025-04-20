import { createIntl, IntlShape } from "@formatjs/intl";

let intl: IntlShape | null = null;

export async function initializeTranslations(locale: string) {
  const messages = (await import(`../../messages/${locale}.json`)).default;
  intl = createIntl({ locale, messages });
}

export function translate(
  id: string,
  defaultMessage: string,
  values?: Record<string, any>
) {
  if (!intl) {
    console.warn("Translations not initialized");
    return defaultMessage;
  }
  return intl.formatMessage({ id, defaultMessage }, values);
}
