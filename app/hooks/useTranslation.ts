"use client";

import { useTranslations } from "next-intl";

export function useTranslation() {
  const t = useTranslations();

  return (
    id: string,
    defaultMessage: string,
    values?: Record<string, any>
  ): string => {
    try {
      return t(id, values);
    } catch {
      return defaultMessage;
    }
  };
}
