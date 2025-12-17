"use client";

import { LoadingScreen, LoadingScreenMode } from "@/widgets/LoadingScreen";
import { useCallback, useState } from "react";

export default function WorksPage() {
  const handleLoadingComplete = useCallback(() => {}, []);
  const [animationsComplete, setAnimationsComplete] = useState(false);

  return (
    <main>
      <h1>works</h1>
      <LoadingScreen
        onAnimationComplete={handleLoadingComplete}
        animationsComplete={animationsComplete}
        mode={LoadingScreenMode.DEFAULT}
      />
    </main>
  );
}
