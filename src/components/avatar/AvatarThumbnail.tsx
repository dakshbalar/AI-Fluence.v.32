import React from "react";
import { AvatarConfig, CharacterMood } from "../../types/avatar";
import { AIfluenceAvatar } from "./AIfluenceAvatar";

interface AvatarThumbnailProps {
  baseConfig?: AvatarConfig;
  overrideConfig?: Partial<AvatarConfig>;
  size?: number;
  className?: string;
  faceZoom?: boolean;
  mood?: CharacterMood;
}

export const AvatarThumbnail: React.FC<AvatarThumbnailProps> = ({
  baseConfig,
  overrideConfig = {},
  size = 64,
  className = "",
  faceZoom = false,
  mood = "still",
}) => {
  const mergedConfig: AvatarConfig = {
    ...(baseConfig as AvatarConfig),
    ...overrideConfig,
  };

  return (
    <div
      className={`relative inline-flex items-center justify-center overflow-hidden ${className}`}
      style={{ width: size, height: size }}
    >
      <AIfluenceAvatar
        config={mergedConfig}
        size={size}
        faceZoom={faceZoom}
        mood={mood}
      />
    </div>
  );
};
