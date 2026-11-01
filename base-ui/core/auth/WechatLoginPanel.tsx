"use client";

import { Button, Spinner } from "@heroui/react";
import { useAuth } from "base-ui/hooks/useAuth";
import { CircleCheckIcon, RefreshCwIcon } from "lucide-react";
import { useTranslations } from "next-intl";
import { QRCodeSVG } from "qrcode.react";
import { useEffect, useState } from "react";

type QrStatus = "pending" | "scanned" | "expired";

// TODO: align with the server-side qr ticket TTL once the real API lands.
const QR_TTL_MS = 60_000;
// Simulated delay between "phone scanned" and "confirmed on phone".
const CONFIRM_DELAY_MS = 1_200;

export function WechatLoginPanel() {
  const t = useTranslations();
  const login = useAuth((s) => s.login);
  const [status, setStatus] = useState<QrStatus>("pending");
  const [ticket, setTicket] = useState(() => crypto.randomUUID());

  // Expiry timer, restarted whenever a fresh ticket is issued.
  useEffect(() => {
    if (status !== "pending") return;
    const timer = setTimeout(() => setStatus("expired"), QR_TTL_MS);
    return () => clearTimeout(timer);
  }, [ticket, status]);

  // Simulated confirmation. TODO: in the real flow this is driven by polling
  // or a push event for the ticket, which then calls login().
  useEffect(() => {
    if (status !== "scanned") return;
    const timer = setTimeout(() => void login(), CONFIRM_DELAY_MS);
    return () => clearTimeout(timer);
  }, [status, login]);

  const refresh = () => {
    setTicket(crypto.randomUUID());
    setStatus("pending");
  };

  // TODO: replace with the real scan URL issued by the backend.
  const qrUrl = `https://raven.ai/auth/qr?ticket=${ticket}`;

  return (
    <>
      <h2 className="text-xl font-semibold">{t("auth.wechatTitle")}</h2>

      <div
        aria-label={t("auth.wechatTitle")}
        className="relative cursor-none rounded-2xl bg-white p-3 shadow-sm"
      >
        <QRCodeSVG value={qrUrl} size={192} level="M" />
        {status !== "pending" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-2xl bg-white/90 p-4">
            {status === "scanned" ? (
              <>
                <CircleCheckIcon className="size-10 text-green-600" />
                <p className="text-sm font-medium text-neutral-900">{t("auth.wechatScanned")}</p>
                <p className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Spinner size="sm" /> {t("auth.wechatScannedHint")}
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-neutral-900">{t("auth.wechatExpired")}</p>
                <Button size="sm" onPress={refresh}>
                  <RefreshCwIcon className="size-4" /> {t("auth.wechatRefresh")}
                </Button>
              </>
            )}
          </div>
        )}
      </div>

      <p className="text-muted text-sm">{t("auth.wechatHint")}</p>
    </>
  );
}
