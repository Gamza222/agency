import { Routes, Route } from "react-router-dom";
import { SentryProvider } from "@/infrastructure/providers/sentry";
import { ThemeProvider } from "@/infrastructure/providers/theme";
import { ScrollSmootherProvider } from "@/infrastructure/providers/scrollsmoother";
import { ErrorBoundary } from "@/infrastructure/error-handling";
import NavbarWrapper from "@/widgets/Navbar/ui/NavbarWrapper";
import { HomePage } from "@/pages/HomePage";
import ContactPage from "@/pages/ContactPage";
import WorksPage from "@/pages/WorksPage";
import TrialPage from "@/pages/TrialPage";
import { FPSMonitor } from "@/shared/lib/performance/FPSMonitor";

function App() {
  return (
    <SentryProvider>
      <ThemeProvider>
        <ErrorBoundary>
          <FPSMonitor />
          <ScrollSmootherProvider>
            <div id="smooth-wrapper">
              <div id="smooth-content">
                <NavbarWrapper />
                <div className="app" style={{ minHeight: "100vh" }}>
                  <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/works" element={<WorksPage />} />
                    <Route path="/trial" element={<TrialPage />} />
                  </Routes>
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
