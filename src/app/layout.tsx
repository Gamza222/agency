import type { Metadata } from "next";
// import { QueryProvider } from "@/infrastructure/providers/query";
import { SentryProvider } from "@/infrastructure/providers/sentry";
import { ThemeProvider } from "@/infrastructure/providers/theme";
import { ErrorBoundary } from "@/infrastructure/error-handling";
import "./globals.css";
import NavbarWrapper from "@/widgets/Navbar/ui/NavbarWrapper";

export const metadata: Metadata = {
  title: "Your App Name",
  description: "Your app description",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SentryProvider>
          <ThemeProvider>
            <ErrorBoundary>
              <NavbarWrapper />
              <div className="app">{children}</div>
            </ErrorBoundary>
          </ThemeProvider>
        </SentryProvider>
      </body>
    </html>
  );
}
