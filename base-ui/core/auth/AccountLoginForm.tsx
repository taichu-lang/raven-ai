"use client";

import { Button, Input, InputGroup, Label, Spinner, TextField } from "@heroui/react";
import { useAuth } from "base-ui/hooks/useAuth";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function AccountLoginForm() {
  const t = useTranslations();
  const login = useAuth((s) => s.login);
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [pending, setPending] = useState(false);

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPending(true);
    try {
      // TODO: real credential check — catch failures here and show FieldError.
      await login({ account });
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-[320px] flex-col gap-4">
      <h2 className="mb-6 text-center text-xl font-semibold">{t("auth.accountTitle")}</h2>

      <TextField isRequired name="account" value={account} onChange={setAccount}>
        <Label>{t("auth.accountLabel")}</Label>
        <Input placeholder={t("auth.accountPlaceholder")} />
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
    </form>
  );
}
