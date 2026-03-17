import crypto from "crypto";

const PUBLIC_KEY = process.env.LIQPAY_PUBLIC_KEY ?? "";
const PRIVATE_KEY = process.env.LIQPAY_PRIVATE_KEY ?? "";

export function buildData(params: Record<string, string | number>): string {
  return Buffer.from(JSON.stringify(params)).toString("base64");
}

export function buildSignature(data: string): string {
  return crypto
    .createHash("sha1")
    .update(PRIVATE_KEY + data + PRIVATE_KEY)
    .digest("base64");
}

export function verifySignature(data: string, signature: string): boolean {
  return buildSignature(data) === signature;
}

export function decodeData(data: string): Record<string, string> {
  return JSON.parse(Buffer.from(data, "base64").toString("utf8")) as Record<string, string>;
}

export function createSubscribeParams(orderId: string, userEmail: string, amount = 4.99, currency = "EUR") {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
  const params = {
    public_key: PUBLIC_KEY,
    version: "3",
    action: "subscribe",
    amount: String(amount),
    currency,
    description: "QRcraft Pro — monthly subscription",
    order_id: orderId,
    subscribe: "1",
    subscribe_date_start: new Date().toISOString().slice(0, 19).replace("T", " "),
    subscribe_periodicity: "month",
    customer: userEmail,
    result_url: `${appUrl}/en/billing?status=success`,
    server_url: `${appUrl}/api/billing/webhook`,
  };
  const data = buildData(params);
  const signature = buildSignature(data);
  return { data, signature };
}

export async function fetchPaymentHistory(dateFrom: Date, dateTo: Date) {
  const params = {
    public_key: PUBLIC_KEY,
    version: "3",
    action: "reports",
    date_from: dateFrom.getTime(),
    date_to: dateTo.getTime(),
    resp_format: "json",
  };
  const data = buildData(params as unknown as Record<string, string | number>);
  const signature = buildSignature(data);

  const res = await fetch("https://www.liqpay.ua/api/request", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ data, signature }),
  });

  return res.json() as Promise<{
    status: string;
    data?: Array<{
      payment_id: string;
      order_id: string;
      status: string;
      amount: number;
      currency: string;
      description: string;
      create_date: number;
      end_date: number;
      customer: string;
    }>;
  }>;
}

export function createUnsubscribeParams(orderId: string) {
  const params = {
    public_key: PUBLIC_KEY,
    version: "3",
    action: "unsubscribe",
    order_id: orderId,
  };
  const data = buildData(params);
  const signature = buildSignature(data);
  return { data, signature };
}
