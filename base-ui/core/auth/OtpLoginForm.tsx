"use client";

import { Button, InputGroup, InputOTP, Label, Link, Spinner, TextField } from "@heroui/react";
import { useAuth, useAuthExt } from "base-ui/hooks/useAuth";
import { useRavenPlatform } from "base-ui/platform";
import { ApiCodeInput } from "base-ui/types/api";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const RESEND_COOLDOWN_S = 60;
const OTP_LENGTH = 6;

export function OtpLoginForm() {
  const t = useTranslations();
  const { login } = useAuthExt();
  const setMethod = useAuth((s) => s.setMethod);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [pending, setPending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { baseUrl } = useRavenPlatform();
  const [error, setError] = useState<string>("");

  // Resend countdown, started whenever a code is issued.
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown((s) => s - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  const sendCode = async () => {
    if (!email || sending || countdown > 0) return;
    setSending(true);
    try {
      await fetch(`${baseUrl}/api/v1/auth/otp/send`, {
        method: "POST",
        body: JSON.stringify({ email, code }),
      });

      setSent(true);
      setCountdown(RESEND_COOLDOWN_S);
    } finally {
      setSending(false);
    }
  };

  const onSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (code.length !== OTP_LENGTH || pending) return;
    setPending(true);
    try {
      const result = await login({ method: "otp", credential: { code, email } });
      switch (result) {
        // TODO(Leo): error handling.
        case ApiCodeInput:
          setError("incorrect code");
          break;

        default:
          break;
      }
    } finally {
      setPending(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-[320px] flex-col gap-4">
      <h2 className="mb-6 text-center text-xl font-semibold">{t("auth.otpTitle")}</h2>

      <TextField isRequired name="email">
        <Label>{t("auth.emailLabel")}</Label>
        <InputGroup>
          <InputGroup.Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("auth.emailPlaceholder")}
          />
          <InputGroup.Suffix className="pe-1">
            <Button
              size="sm"
              variant="ghost"
              isDisabled={!email || countdown > 0}
              onPress={() => void sendCode()}
            >
              {sending ? (
                <Spinner color="current" size="sm" />
              ) : !sent ? (
                t("auth.otpSendCode")
              ) : countdown > 0 ? (
                t("auth.otpResendCountdown", { seconds: countdown })
              ) : (
                t("auth.otpResend")
              )}
            </Button>
          </InputGroup.Suffix>
        </InputGroup>
      </TextField>

      <div className="flex flex-col gap-2">
        <Label>{t("auth.otpCodeLabel")}</Label>
        <InputOTP
          maxLength={OTP_LENGTH}
          value={code}
          onChange={(v) => {
            setCode(v);
            setError("");
          }}
          isDisabled={!sent}
          className="w-fit"
        >
          <InputOTP.Group>
            {Array.from({ length: OTP_LENGTH / 2 }, (_, i) => (
              <InputOTP.Slot index={i} key={i} className={error ? "ring-danger ring ring-inset" : ""} />
            ))}
          </InputOTP.Group>
          <InputOTP.Separator />
          <InputOTP.Group>
            {Array.from({ length: OTP_LENGTH / 2 }, (_, i) => (
              <InputOTP.Slot
                index={OTP_LENGTH / 2 + i}
                key={OTP_LENGTH / 2 + i}
                className={error ? "ring-danger ring ring-inset" : ""}
              />
            ))}
          </InputOTP.Group>
        </InputOTP>
      </div>

      <Button type="submit" isPending={pending} isDisabled={code.length !== OTP_LENGTH} className="mt-2 w-full">
        {({ isPending }) => (
          <>
            {isPending ? <Spinner color="current" size="sm" /> : null}
            {t("auth.otpSubmit")}
          </>
        )}
      </Button>

      <p className="text-muted text-center text-xs">{t("auth.otpNewAccountNote")}</p>

      <div className="mt-2 text-center">
        <Link className="text-foreground text-sm underline" onPress={() => setMethod("password")}>
          {t("auth.otpBackToPassword")}
        </Link>
      </div>
    </form>
  );
}
