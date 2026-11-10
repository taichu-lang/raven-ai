"use client";

import { Button, Modal } from "@heroui/react";
import { useAuth, useAuthExt } from "base-ui/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { AccountLoginForm } from "./AccountLoginForm";
import { FeatureCarousel } from "./FeatureCarousel";
import { OtpLoginForm } from "./OtpLoginForm";
import { WechatLoginPanel } from "./WechatLoginPanel";

export function LoginModal() {
  const t = useTranslations();
  const { isModalOpen, toggleAuthModal, method, setMethod } = useAuth();
  const { restore } = useAuthExt();

  useEffect(() => {
    // The persisted profile is already shown, verify the session with the backend.
    void restore();
  }, [restore]);

  return (
    <Modal.Backdrop
      isOpen={isModalOpen}
      onOpenChange={toggleAuthModal}
      variant="blur"
      className="bg-overlay/50"
    >
      <Modal.Container placement="center">
        <Modal.Dialog aria-label={t("auth.title")} className="relative overflow-hidden sm:max-w-4xl">
          <Modal.CloseTrigger className="absolute top-3 right-3 z-10" />
          <Modal.Body className="p-0">
            <div className="grid md:grid-cols-[400px_1fr]">
              {/* Left: feature carousel, hidden on mobile */}
              <div className="hidden md:block">
                <FeatureCarousel />
              </div>

              {/* Right: login methods */}
              <div className="flex min-h-[460px] flex-col items-center justify-center gap-6 p-10 md:min-h-[560px] md:pt-12">
                {method === "wechat" ? (
                  <WechatLoginPanel />
                ) : method === "otp" ? (
                  <OtpLoginForm />
                ) : (
                  <AccountLoginForm />
                )}

                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => setMethod(method === "wechat" ? "password" : "wechat")}
                >
                  {method === "wechat" ? t("auth.switchToAccount") : t("auth.switchToWechat")}
                </Button>

                <p className="text-muted mt-auto max-w-[300px] text-center text-xs">{t("auth.agreement")}</p>
              </div>
            </div>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
