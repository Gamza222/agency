"use client";

import {
  LoadingScreen,
  LoadingScreenMode,
  useLoadingScreenState,
} from "@/widgets/LoadingScreen";

export default function WorksPage() {
  const { animationsComplete, handleAnimationComplete } =
    useLoadingScreenState();

  return (
    <main>
      <h1>works</h1>
      <LoadingScreen
        onAnimationComplete={handleAnimationComplete}
        animationsComplete={animationsComplete}
        mode={LoadingScreenMode.DEFAULT}
      />
    </main>
  );
}


