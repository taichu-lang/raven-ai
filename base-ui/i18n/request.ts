import { getTranslations } from "hero-next/i18n/request";
import { getRequestConfig } from "next-intl/server";

export default getRequestConfig(async ({ locale }) => {
  const { locale: resolved, messages } = await getTranslations(locale);
  const app = await (await import(`./${resolved}.json`)).default;

  return {
    locale: resolved,
    messages: {
      ...messages,
      ...app,
    },
  };
});
