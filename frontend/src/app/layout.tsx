import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "iLoad",
  description: "iLoad",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko-KR" suppressHydrationWarning>
      <body className="antialiased min-h-screen flex flex-col items-center">
        <div className="max-w-2xl min-w-xs w-full">
          {/* 헤더, 푸터 등 공통 레이아웃 요소는 여기에 추가 */}
          {children}
        </div>
      </body>
    </html>
  );
}
