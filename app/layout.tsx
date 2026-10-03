import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Arbuda Times | Wholesale Watches", template: "%s | Arbuda Times" },
  description: "Browse the latest wholesale watch collection for retailers. View MOQ, pricing and send a multi-product enquiry on WhatsApp.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
