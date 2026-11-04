"use client";

import { Button, Input, InputGroup, Label, Link, Spinner, TextField } from "@heroui/react";
import { useAuth, useAuthExt } from "base-ui/hooks/useAuth";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function AccountLoginForm() {
  const t = useTranslations();
  const { login } = useAuthExt();
  const setMethod = useAuth((s) => s.setMethod);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    try {
      await login({ method: "password", credential: { email, password } });
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-[320px] flex-col gap-4">
      <h2 className="mb-6 text-center text-xl font-semibold">{t("auth.accountTitle")}</h2>

      <TextField isRequired name="email" value={email} onChange={setEmail}>
        <Label>{t("auth.emailLabel")}</Label>
        <Input placeholder={t("auth.emailPlaceholder")} />
      </TextField>

      <TextField isRequired name="password">
        <Label>{t("auth.passwordLabel")}</Label>
        <InputGroup>
          <InputGroup.Input
            type={visible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder={t("auth.passwordPlaceholder")}
          />
          <InputGroup.Suffix className="pe-0">
            <Button
              isIconOnly
              size="sm"
              variant="ghost"
              aria-label={visible ? t("auth.hidePassword") : t("auth.showPassword")}
              onPress={() => setVisible(!visible)}
            >
              {visible ? <EyeOffIcon className="size-4" /> : <EyeIcon className="size-4" />}
            </Button>
          </InputGroup.Suffix>
        </InputGroup>
      </TextField>

      <Button type="submit" isPending={pending} className="mt-2 w-full">
        {({ isPending }) => (
          <>
            {isPending ? <Spinner color="current" size="sm" /> : null}
            {t("auth.submit")}
          </>
        )}
      </Button>

      {/* The OTP path covers both "forgot my password" and first-time visitors:
          no sign-up flow exists — a verified code creates the account. */}
      <div className="mt-4 flex flex-col items-center gap-1 text-center">
        <p className="text-muted text-sm">{t("auth.otpHint")}</p>
        <Link className="text-foreground text-sm underline" onPress={() => setMethod("otp")}>
          {t("auth.otpEntry")}
        </Link>
      </div>
    </form>
  );
}
