"use client";

import { useEffect, useRef } from "react";
import QRCodeStyling from "qr-code-styling";
import type { QRDesign } from "@/models/QRCode";

interface Props {
  value: string;
  design: QRDesign;
  size?: number;
}

// Map our design types to qr-code-styling types
type DotType = "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded";
type CornerSquareType = "square" | "dot" | "extra-rounded";

export default function QRPreviewInner({ value, design, size = 200 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const qrRef = useRef<QRCodeStyling | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const dotType = design.dotStyle as DotType;
    const cornerType = design.cornerStyle === "rounded"
      ? ("extra-rounded" as CornerSquareType)
      : (design.cornerStyle as CornerSquareType);

    if (!qrRef.current) {
      qrRef.current = new QRCodeStyling({
        width: size,
        height: size,
        data: value || "https://qrcraft.app",
        dotsOptions: {
          color: design.fgColor,
          type: dotType,
        },
        backgroundOptions: {
          color: design.bgColor,
        },
        cornersSquareOptions: {
          type: cornerType,
        },
        qrOptions: {
          errorCorrectionLevel: "M",
        },
      });
      qrRef.current.append(ref.current);
    } else {
      qrRef.current.update({
        data: value || "https://qrcraft.app",
        dotsOptions: {
          color: design.fgColor,
          type: dotType,
        },
        backgroundOptions: { color: design.bgColor },
        cornersSquareOptions: { type: cornerType },
      });
    }
  }, [value, design, size]);

  return <div ref={ref} />;
}
