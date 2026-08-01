import "./globals.css";
import localFont from "next/font/local";

const Cairo_Arabic_Font = localFont({
  src: "./fonts/Cairo-Regular.ttf",
  display: "swap",
});

export default function DashboardLayout({ children }) {
  return (
    <html lang="ar">
      <body className={Cairo_Arabic_Font.className}>{children}</body>
    </html>
  );
}
