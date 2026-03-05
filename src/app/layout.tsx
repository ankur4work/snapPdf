import type { Metadata } from "next";
import { Providers } from "@/components/Providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "SnapPDF — Turn Screenshots into Perfect PDFs",
  description:
    "Drag-and-drop screenshots and instantly get a downloadable, OCR-searchable PDF. Entirely in your browser — your images never leave your device.",
  keywords: ["PDF converter", "screenshot to PDF", "OCR PDF", "searchable PDF", "image to PDF"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
