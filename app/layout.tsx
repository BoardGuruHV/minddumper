import type { Metadata } from "next";
import "./globals.css";

// This wraps every page in the app. It sets the page title and loads our styles.
export const metadata: Metadata = {
  title: "MindDumper",
  description: "your safe space to dump it all",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
