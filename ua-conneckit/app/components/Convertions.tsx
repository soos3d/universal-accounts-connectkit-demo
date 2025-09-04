"use client";

import { useState } from "react";
import "./animations.css";
import {
  UniversalAccount,
  CHAIN_ID,
  SUPPORTED_TOKEN_TYPE,
} from "@particle-network/universal-account-sdk";
import { Button } from "../../components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ConvertToUsdcProps {
  universalAccountInstance: UniversalAccount | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletClient: any;
  address: string | undefined;
}

export default function ConvertToUsdc({
  universalAccountInstance,
  walletClient,
  address,
}: ConvertToUsdcProps) {
  const [amount, setAmount] = useState<string>("1"); // human-readable USDC
  const [txResult, setTxResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const runConversion = async () => {
    if (!universalAccountInstance) return;
    setIsLoading(true);
    setTxResult(null);

    try {
      if (!amount || Number(amount) <= 0) {
        throw new Error("Please enter a valid USDC amount.");
      }

      // 1) Ask UA to ensure `amount` USDC on Arbitrum (auto-sourcing from your assets elsewhere)
      const transaction =
        await universalAccountInstance.createConvertTransaction({
          expectToken: { type: SUPPORTED_TOKEN_TYPE.USDC, amount: "1" },
          chainId: CHAIN_ID.SOLANA_MAINNET,
        });

      // 2) Sign UA payload
      const signature = await walletClient?.signMessage({
        account: address as `0x${string}`,
        message: { raw: transaction.rootHash },
      });

      // 3) Send via UA
      const result = await universalAccountInstance.sendTransaction(
        transaction,
        signature
      );

      setTxResult(
        `https://universalx.app/activity/details?id=${result.transactionId}`
      );
    } catch (error) {
      console.error("Convert transaction failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setTxResult(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4 h-full flex flex-col">
      <h3 className="text-xl font-semibold text-gray-200 border-b border-[#4A4A6A] pb-2 text-center">
        Cross-Chain Conversion
      </h3>

      <div className="bg-[#2A2A4A] rounded-lg p-6 border border-[#4A4A6A] shadow-inner flex flex-col gap-4 hover:border-purple-500 transition-colors flex-grow">
        <div className="w-full mb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium text-purple-300">
              Convert to USDC
            </h4>
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="text-purple-300 hover:text-purple-400 transition-colors"
              aria-label={showDetails ? "Hide details" : "Show details"}
            >
              {showDetails ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>

          {showDetails && (
            <div className="mt-3 animate-fadeIn">
              <p className="text-sm text-gray-300 mb-4">
                This runs a conversion so your Universal Account ends up with{" "}
                <span className="font-semibold">{amount || "X"}</span> USDC on
                Solana. UA handles sourcing and swapping from assets you hold on
                other chains.
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>Destination Network: Solana</span>
                <a
                  href="https://github.com/soos3d/universal-accounts-connectkit-demo/blob/main/ua-conneckit/app/components/Convertions.tsx"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline flex items-center gap-1"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77A5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  View Code on GitHub
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Amount input */}
        <div className="w-full">
          <p className="text-sm text-gray-300 mb-2">Amount (USDC)</p>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value.trim())}
            placeholder="e.g. 1.00"
            className="w-full px-4 py-2 bg-[#1A1A2A] border border-[#4A4A6A] rounded-md text-gray-200 placeholder-gray-500 focus:outline-none"
            inputMode="decimal"
          />
        </div>

        <Button
          onClick={runConversion}
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-lg font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Converting..." : "Convert to USDC"}
        </Button>

        {txResult && (
          <div className="mt-4 text-center text-sm">
            {txResult.startsWith("Error") ? (
              <p className="text-red-400 break-all">{txResult}</p>
            ) : (
              <a
                href={txResult}
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 hover:underline break-all"
              >
                View Transaction on Explorer
              </a>
            )}
          </div>
        )}

        <div className="w-full mt-2 pt-3 border-t border-[#4A4A6A]">
          <div className="flex justify-between items-start">
            <p className="text-xs text-gray-400">
              <span className="font-medium text-gray-300">
                SDK Functions Used:
              </span>
              <br />
              <code className="bg-[#1A1A2A] px-1 py-0.5 rounded text-purple-300 mx-1">
                createConvertTransaction
              </code>
              ,
              <br />
              <code className="bg-[#1A1A2A] px-1 py-0.5 rounded text-purple-300 mx-1">
                sendTransaction
              </code>
            </p>
            <a
              href="https://developers.particle.network/universal-accounts/ua-reference/desktop/web#sending-a-conversion-transaction"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-purple-400 hover:underline flex items-center gap-1"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
              View Docs
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
