"use client";

import { Typography } from "@heroui/react";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations();

  return <Typography type="body">{t("app")}</Typography>;
}
