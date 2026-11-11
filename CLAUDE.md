@AGENTS.md

## Code style

- Use `useTranslations()` without a namespace and pass full keys (e.g., `t("models.search")`), never `useTranslations("models")` with `t("search")`. This keeps it easy to grep which keys are in use.
