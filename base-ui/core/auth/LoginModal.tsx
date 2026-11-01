"use client";

import { Button, Modal } from "@heroui/react";
import { useAuth } from "base-ui/hooks/useAuth";
import { useTranslations } from "next-intl";
import { AccountLoginForm } from "./AccountLoginForm";
import { FeatureCarousel } from "./FeatureCarousel";
import { WechatLoginPanel } from "./WechatLoginPanel";

export function LoginModal() {
  const t = useTranslations();
  const { isModalOpen, toggleAuthModal, method, setMethod } = useAuth();

  return (
    <Modal.Backdrop
      isOpen={isModalOpen}
      onOpenChange={toggleAuthModal}
      variant="blur"
      className="bg-overlay/50"
    >
      <Modal.Container placement="center">
        <Modal.Dialog aria-label={t("auth.title")} className="relative overflow-hidden sm:max-w-[880px]">
          <Modal.CloseTrigger className="absolute top-3 right-3 z-10" />
          <Modal.Body className="p-0">
            <div className="grid md:grid-cols-[400px_1fr]">
              {/* Left: feature carousel, hidden on mobile */}
              <div className="hidden md:block">
                <FeatureCarousel />
              </div>

              {/* Right: login methods */}
              <div className="flex min-h-[460px] flex-col items-center justify-center gap-6 p-8 md:min-h-[560px] md:p-10">
                {method === "wechat" ? <WechatLoginPanel /> : <AccountLoginForm />}

                <Button
                  variant="ghost"
                  size="sm"
                  onPress={() => setMethod(method === "wechat" ? "email" : "wechat")}
                >
                  {method === "wechat" ? t("auth.switchToAccount") : t("auth.switchToWechat")}
                </Button>

                <p className="text-muted max-w-[300px] text-center text-xs">{t("auth.agreement")}</p>
              </div>
            </div>
          </Modal.Body>
        </Modal.Dialog>
      </Modal.Container>
    </Modal.Backdrop>
  );
}
