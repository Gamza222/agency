import { SentryProvider } from "@/infrastructure/providers/sentry";
import { ThemeProvider } from "@/infrastructure/providers/theme";
import { ScrollSmootherProvider } from "@/infrastructure/providers/scrollsmoother";
import { ErrorBoundary } from "@/infrastructure/error-handling";
import NavbarWrapper from "@/widgets/Navbar/ui/NavbarWrapper";
import { HomePage } from "@/pages/HomePage";

function App() {
  return (
    <SentryProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <NavbarWrapper />
        
          <ScrollSmootherProvider>
            <div id="smooth-wrapper">
              <div id="smooth-content">
                <div className="app" style={{ minHeight: "100dvh" }}>
                <HomePage />
                </div>
              </div>
            </div>
          </ScrollSmootherProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </SentryProvider>
  );
}

export default App;
