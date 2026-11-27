"use client";

import { Modal, Tabs } from "@heroui/react";
import { useAuth, useAuthExt } from "base-ui/hooks/useAuth";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import { AuthMethod } from "../types/profile";
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
              <div className="flex min-h-115 flex-col items-center justify-between gap-6 p-10 md:min-h-140 md:pt-12">
                <Tabs className="mx-auto flex w-fit" onSelectionChange={(key) => setMethod(key as AuthMethod)}>
                  <Tabs.ListContainer>
                    <Tabs.List aria-label="options">
                      <Tabs.Tab id="password">{t("auth.switchToAccount")}</Tabs.Tab>
                      <Tabs.Tab id="wechat">{t("auth.switchToWechat")}</Tabs.Tab>
                    </Tabs.List>
                  </Tabs.ListContainer>
                </Tabs>
                {method === "wechat" && <WechatLoginPanel />}
                {method === "otp" && <OtpLoginForm />}
                {method === "password" && <AccountLoginForm />}

                <p className="text-muted max-w-75 text-center text-xs">{t("auth.agreement")}</p>
              </div>
            </div>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
