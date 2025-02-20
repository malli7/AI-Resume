import type { Metadata } from "next";
import "../globals.css";
import ClerkProviders from "./providers/ClerkProviders";

export const metadata: Metadata = {
  title: "AI-Powered Resume Builder",
  description: "AI-Powered Resume Builder",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProviders>{children}</ClerkProviders>
      </body>
    </html>
  );
}
