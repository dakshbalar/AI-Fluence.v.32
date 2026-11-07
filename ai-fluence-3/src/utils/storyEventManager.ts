import { useState, useCallback } from "react";

export interface StoryEvent {
  id: string;
  character: "aiden" | "lumi" | "vex";
  title: string;
  dialogue: string[];
  rewardXp?: number;
}

export function useCharacterStoryEvent() {
  const [activeStoryEvent, setActiveStoryEvent] = useState<StoryEvent | null>(null);

  const closeStoryEvent = useCallback(() => {
    setActiveStoryEvent(null);
  }, []);

  const launchEvent = useCallback((event: StoryEvent) => {
    setActiveStoryEvent(event);
  }, []);

  return {
    activeStoryEvent,
    closeStoryEvent,
    launchEvent,
    isDailyWelcomeAvailable: false,
  };
}

export function triggerCharacterStoryEvent(_event: any) {
  // no-op trigger
}
