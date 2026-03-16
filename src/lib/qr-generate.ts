import QRCode from "qrcode";
import type { QRType } from "@/models/QRCode";

interface VCardData {
  name?: string;
  phone?: string;
  email?: string;
  org?: string;
}

interface WifiData {
  ssid: string;
  password?: string;
  security?: "WPA" | "WEP" | "nopass";
}

interface EventData {
  title?: string;
  start?: string;
  end?: string;
  location?: string;
}

export function buildQRString(type: QRType, content: string): string {
  switch (type) {
    case "url":
      return content.startsWith("http") ? content : `https://${content}`;

    case "text":
      return content;

    case "vcard": {
      let data: VCardData = {};
      try {
        data = JSON.parse(content) as VCardData;
      } catch {
        return content;
      }
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        data.name ? `FN:${data.name}` : "",
        data.phone ? `TEL:${data.phone}` : "",
        data.email ? `EMAIL:${data.email}` : "",
        data.org ? `ORG:${data.org}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
    }

    case "wifi": {
      let data: WifiData = { ssid: "" };
      try {
        data = JSON.parse(content) as WifiData;
      } catch {
        return content;
      }
      const sec = data.security ?? "WPA";
      return `WIFI:T:${sec};S:${data.ssid};P:${data.password ?? ""};;`;
    }

    case "event": {
      let data: EventData = {};
      try {
        data = JSON.parse(content) as EventData;
      } catch {
        return content;
      }
      return [
        "BEGIN:VEVENT",
        data.title ? `SUMMARY:${data.title}` : "",
        data.start ? `DTSTART:${data.start}` : "",
        data.end ? `DTEND:${data.end}` : "",
        data.location ? `LOCATION:${data.location}` : "",
        "END:VEVENT",
      ]
        .filter(Boolean)
        .join("\n");
    }

    default:
      return content;
  }
}

export async function generateQRDataURL(
  qrString: string,
  fgColor = "#000000",
  bgColor = "#ffffff"
): Promise<string> {
  return QRCode.toDataURL(qrString, {
    color: { dark: fgColor, light: bgColor },
    width: 400,
    margin: 2,
    errorCorrectionLevel: "M",
  });
}
