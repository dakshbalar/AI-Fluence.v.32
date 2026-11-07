import React from "react";
import { MapStyleAuthCard } from "./auth/MapStyleAuthCard";

interface AuthViewProps {
  initialTab?: "login" | "signup";
  onSuccess?: () => void;
  onCancel?: () => void;
}

export const AuthView: React.FC<AuthViewProps> = ({ onSuccess, onCancel }) => {
  return (
    <div className="fixed inset-0 z-[300] bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="relative w-full max-w-md">
        <MapStyleAuthCard
          onSuccess={onSuccess || (() => {})}
          onContinueAsGuest={onCancel || (() => {})}
        />
      </div>
    </div>
  );
};

export default AuthView;
