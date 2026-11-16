import { prisma } from "@/lib/prisma";

export async function sendSms(phone: string, message: string) {
  const username = process.env.AT_USERNAME;
  const apiKey = process.env.AT_API_KEY;
  if (!username || !apiKey) {
    await prisma.notification.create({
      data: { phone, channel: "sms", message, status: "not-configured" },
    });
    return "not-configured" as const;
  }

  try {
    const body = new URLSearchParams({ username, to: phone, message });
    if (process.env.AT_SENDER_ID) body.set("from", process.env.AT_SENDER_ID);
    const response = await fetch(
      process.env.AT_ENVIRONMENT === "production"
        ? "https://api.africastalking.com/version1/messaging"
        : "https://api.sandbox.africastalking.com/version1/messaging",
      {
        method: "POST",
        headers: {
          apiKey,
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body,
        signal: AbortSignal.timeout(15_000),
      },
    );
    const responseText = await response.text();
    const status = response.ok ? "sent" : "failed";
    await prisma.notification.create({
      data: { phone, channel: "sms", message, status },
    });
    if (!response.ok) console.error("Africa's Talking SMS failed:", response.status, responseText);
    return status as "sent" | "failed";
  } catch (error) {
    console.error("Africa's Talking SMS request failed:", error);
    await prisma.notification.create({
      data: { phone, channel: "sms", message, status: "failed" },
    });
    return "failed" as const;
  }
}
