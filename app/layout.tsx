import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KIVORA — Ideas into Impact",
  description:
    "A learning and innovation ecosystem connecting real community challenges with student ideas.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
