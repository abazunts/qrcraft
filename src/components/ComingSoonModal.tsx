"use client";

import { useTranslations } from "next-intl";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function ComingSoonModal({ isOpen, onClose }: Props) {
  const t = useTranslations();

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-center py-2">
        <div className="text-5xl mb-4">🚀</div>
        <h2 className="text-xl font-bold mb-3" style={{ color: "var(--text)" }}>
          {t("comingSoon.title")}
        </h2>
        <p className="text-sm mb-6" style={{ color: "var(--muted)" }}>
          {t("comingSoon.desc")}
        </p>
        <Button variant="primary" onClick={onClose} className="w-full">
          {t("comingSoon.close")}
        </Button>
      </div>
    </Modal>
  );
}
