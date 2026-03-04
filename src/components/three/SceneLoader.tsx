"use client";

import dynamic from "next/dynamic";
import { Suspense, type ComponentType } from "react";

function SceneFallback() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
    </div>
  );
}

export function withSceneLoader<P extends object>(
  importFn: () => Promise<{ default: ComponentType<P> }>
) {
  const DynamicComponent = dynamic(importFn, { ssr: false });

  function SceneWrapper(props: P) {
    return (
      <Suspense fallback={<SceneFallback />}>
        <DynamicComponent {...props} />
      </Suspense>
    );
  }

  SceneWrapper.displayName = `SceneLoader(${importFn.name || "Scene"})`;
  return SceneWrapper;
}
