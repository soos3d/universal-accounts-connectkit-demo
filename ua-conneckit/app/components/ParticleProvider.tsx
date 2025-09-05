"use client";

import { ConnectKitProvider, createConfig } from "@particle-network/connectkit";
import { authWalletConnectors } from "@particle-network/connectkit/auth";
import { arbitrum } from "@particle-network/connectkit/chains";
import { evmWalletConnectors } from "@particle-network/connectkit/evm";
import { wallet, EntryPosition } from "@particle-network/connectkit/wallet";
import React from "react";
import { useWalletVisibility } from "../context/WalletVisibilityContext";

// Retrieved from https://dashboard.particle.network
const projectId = process.env.NEXT_PUBLIC_PROJECT_ID as string;
const clientKey = process.env.NEXT_PUBLIC_CLIENT_KEY as string;
const appId = process.env.NEXT_PUBLIC_APP_ID as string;

if (!projectId || !clientKey || !appId) {
  throw new Error("Please configure the Particle project in .env first!");
}

// Export ConnectKitProvider to be used within your index or layout file (or use createConfig directly within those files).
export const ParticleConnectkit = ({ children }: React.PropsWithChildren) => {
  const { isWalletVisible } = useWalletVisibility();

  const config = createConfig({
    projectId,
    clientKey,
    appId,
    appearance: {
      splitEmailAndPhone: false, // Optional, displays Email and phone number entry separately
      collapseWalletList: false, // Optional, hide wallet list behind a button
      hideContinueButton: true, // Optional, remove "Continue" button underneath Email or phone number entry
      connectorsOrder: ["social", "wallet", "email", "phone"], //  Optional, sort connection methods (index 0 will be placed at the top)
      language: "en-US", // Optional, also supported ja-JP, zh-CN, zh-TW, and ko-KR
      mode: "dark", // Optional, changes theme between light, dark, or auto (which will change it based on system settings)
      recommendedWallets: [{ walletId: "metaMask", label: "Popular" }],
    },
    walletConnectors: [
      authWalletConnectors({
        // Optional, configure this if you're using social logins
        authTypes: [
          "google",
          "apple",
          "twitter",
          "github",
          "email",
          "phone",
          "facebook",
          "microsoft",
          "linkedin",
          "discord",
          "twitch",
        ], // Optional, restricts the types of social logins supported
        fiatCoin: "USD", // Optional, also supports CNY, JPY, HKD, INR, and KRW
        promptSettingConfig: {
          // Optional, changes the frequency in which the user is asked to set a master or payment password
          // 0 = Never ask
          // 1 = Ask once
          // 2 = Ask always, upon every entry
          // 3 = Force the user to set this password
          promptMasterPasswordSettingWhenLogin: 1,
          promptPaymentPasswordSettingWhenSign: 1,
        },
      }),
      evmWalletConnectors({
        walletConnectProjectId: process.env
          .NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID as string,
        multiInjectedProviderDiscovery: true,
      }),
    ],
    plugins: [
      wallet({
        // Optional configurations for the attached embedded wallet modal
        entryPosition: EntryPosition.BR, // Alters the position in which the modal button appears upon login
        visible: isWalletVisible, // Dictates whether or not the wallet modal is included/visible or not
      }),
    ],
    chains: [arbitrum],
  });

  return <ConnectKitProvider config={config}>{children}</ConnectKitProvider>;
};
