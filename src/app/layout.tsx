import "./globals.css";
import type { Metadata } from "next";
import EntryAnimationGSAP from "@/components/EntryAnimationGSAP";

export const metadata: Metadata = {
  title: "Travel Generator",
  description: "Discover your next adventure",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <EntryAnimationGSAP>
          {children}
        </EntryAnimationGSAP>
      </body>
    </html>
  );
}
