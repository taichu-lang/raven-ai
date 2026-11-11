import { getTranslations } from "hero-next/i18n/request";
import { getRequestConfig } from "next-intl/server";

type Messages = Record<string, unknown>;

// App messages win over hero-next ones at the leaf level, so both can share a namespace
// (e.g. `chat` for the shell copy here and `chat.action` from hero-next).
function mergeMessages(base: Messages, override: Messages): Messages {
  const merged: Messages = { ...base };
  for (const [key, value] of Object.entries(override)) {
    const current = merged[key];
    merged[key] =
      current && value && typeof current === "object" && typeof value === "object"
        ? mergeMessages(current as Messages, value as Messages)
        : value;
  }
  return merged;
}

export default getRequestConfig(async ({ locale }) => {
  const { locale: resolved, messages } = await getTranslations(locale);
  const app = await (await import(`./${resolved}.json`)).default;

  return {
    locale: resolved,
    messages: mergeMessages(messages, app),
  };
});
