"use client";

import React, { useState } from "react";
import { LoadingScreen, LoadingScreenMode } from "@/widgets/LoadingScreen";

export default function ContactPage() {
  const [showContent, setShowContent] = useState(false);

  const handleExitComplete = () => {
    // Content is revealed after exit animation completes
    setShowContent(true);
  };

  return (
    <main>
      {!showContent && (
        <LoadingScreen
          onExitComplete={handleExitComplete}
          mode={LoadingScreenMode.DEFAULT}
        />
      )}
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transition: "opacity 0.3s ease",
        }}
      >
        <h1>contact</h1>
      </div>
    </main>
  );
}
