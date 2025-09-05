"use client";

import React, { createContext, useContext, useState } from "react";

interface WalletVisibilityContextType {
  isWalletVisible: boolean;
  toggleWalletVisibility: () => void;
}

const WalletVisibilityContext = createContext<WalletVisibilityContextType | undefined>(undefined);

export const WalletVisibilityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isWalletVisible, setIsWalletVisible] = useState(true);

  const toggleWalletVisibility = () => {
    setIsWalletVisible(prev => !prev);
  };

  return (
    <WalletVisibilityContext.Provider value={{ isWalletVisible, toggleWalletVisibility }}>
      {children}
    </WalletVisibilityContext.Provider>
  );
};

export const useWalletVisibility = () => {
  const context = useContext(WalletVisibilityContext);
  if (context === undefined) {
    throw new Error("useWalletVisibility must be used within a WalletVisibilityProvider");
  }
  return context;
};
