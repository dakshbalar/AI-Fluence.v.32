import React from "react";
import { MapStyleAuthCard } from "./MapStyleAuthCard";

interface CinematicSupercellAuthScreenProps {
  onSuccess?: () => void;
  onContinueAsGuest?: () => void;
}

export const CinematicSupercellAuthScreen: React.FC<CinematicSupercellAuthScreenProps> = ({
  onSuccess,
  onContinueAsGuest,
}) => {
  return (
    <div className="fixed inset-0 z-[350] bg-[#050811] flex items-center justify-center p-4">
      <MapStyleAuthCard
        onSuccess={onSuccess || (() => {})}
        onContinueAsGuest={onContinueAsGuest || (() => {})}
      />
    </div>
  );
};

export default CinematicSupercellAuthScreen;
