import dynamic from "next/dynamic";
import type { QRDesign } from "@/models/QRCode";

interface Props {
  value: string;
  design: QRDesign;
  size?: number;
}

const QRPreviewInner = dynamic(() => import("./QRPreviewInner"), {
  ssr: false,
  loading: () => (
    <div
      className="flex items-center justify-center rounded-xl"
      style={{
        width: 200,
        height: 200,
        background: "var(--surface2)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="text-sm" style={{ color: "var(--muted)" }}>
        Loading...
      </div>
    </div>
  ),
});

export default function QRPreview({ value, design, size = 200 }: Props) {
  return <QRPreviewInner value={value} design={design} size={size} />;
}
