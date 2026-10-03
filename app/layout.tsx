import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Arbuda Times | Fun Watches for Kids", template: "%s | Arbuda Times" },
  description: "Discover colorful, comfortable watches made just for kids. Shop fun styles for school, playtime, birthdays and gifting.",
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
