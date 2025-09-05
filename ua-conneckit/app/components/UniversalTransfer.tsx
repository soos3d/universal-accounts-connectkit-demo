"use client";

import { useState } from "react";
import "./animations.css";
import {
  UniversalAccount,
  CHAIN_ID,
  SUPPORTED_TOKEN_TYPE,
} from "@particle-network/universal-account-sdk";
import { Interface, parseUnits } from "ethers";
import { Button } from "../../components/ui/button";
import { Switch } from "../../components/ui/switch";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";
import { useWalletVisibility } from "../context/WalletVisibilityContext";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

interface UsdcTransferProps {
  universalAccountInstance: UniversalAccount | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletClient: any;
  address: string | undefined;
}

export default function UsdcTransfer({
  universalAccountInstance,
  walletClient,
  address,
}: UsdcTransferProps) {
  const [txResult, setTxResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const [amount, setAmount] = useState<string>(""); // human-readable USDC, e.g. "12.34"

  const { isWalletVisible, toggleWalletVisibility } = useWalletVisibility();

  // Native USDC on Arbitrum (not USDC.e)
  const USDC_ARBITRUM = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831";

  const runTransaction = async () => {
    if (!universalAccountInstance) return;

    setIsLoading(true);
    setTxResult(null);

    try {
      if (!amount || Number(amount) <= 0) {
        throw new Error("Please enter a valid USDC amount.");
      }

      // ERC-20 transfer ABI
      const erc20 = new Interface([
        "function transfer(address to, uint256 amount) external returns (bool)",
      ]);

      // USDC uses 6 decimals
      const amount6 = parseUnits(amount, 6);

      // 1) Build a chain-abstracted transfer on Arbitrum
      const transaction =
        await universalAccountInstance.createUniversalTransaction({
          chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE, // use the enum value from your SDK
          // Ensure this much USDC exists on Arbitrum before executing
          expectTokens: [
            {
              type: SUPPORTED_TOKEN_TYPE.USDC,
              amount, // human-readable string e.g. "12.34"
            },
          ],
          transactions: [
            {
              to: USDC_ARBITRUM,
              data: erc20.encodeFunctionData("transfer", [address, amount6]),
              //value: "0x0", // no native value for ERC-20 transfer
            },
          ],
        });
      console.log("transaction", JSON.stringify(transaction));
      // 2) Sign the UA transaction hash with the connected wallet
      const signature = await walletClient?.signMessage({
        account: address as `0x${string}`,
        message: { raw: transaction.rootHash },
      });

      // 3) Send through UA
      const result = await universalAccountInstance.sendTransaction(
        transaction,
        signature
      );

      setTxResult(
        `https://universalx.app/activity/details?id=${result.transactionId}`
      );
    } catch (error) {
      console.error("USDC transfer failed:", error);
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
        User Deposit Flow
      </h3>

      <div className="bg-[#2A2A4A] rounded-lg p-6 border border-[#4A4A6A] shadow-inner flex flex-col gap-4 hover:border-purple-500 transition-colors flex-grow">
        <div className="w-full mb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium text-purple-300">
              Send Funds to EOA
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
                This example demonstrates how to send funds from your Universal
                Account to your connected EOA wallet. The transaction send USDC
                to your EOA wallet on Arbitrum, independently from the funds you
                hold in your Universal Account.
                <br />
                <br />
                This sends{" "}
                <span className="font-semibold">{amount || "X"}</span> USDC to{" "}
                <span className="font-semibold">
                  {address
                    ? `${address.slice(0, 6)}…${address.slice(-4)}`
                    : "0x…"}
                </span>{" "}
                (the connected EOA) on Arbitrum.
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-2">
                <span>USDC (Arbitrum): 0xaf88…5831</span>
                <a
                  href="https://arbiscan.io/token/0xaf88d065e77c8cc2239327c5edb3a432268e5831"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-purple-400 hover:underline"
                >
                  View on Arbiscan
                </a>
              </div>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>Use UAs as deposit flow</span>
                <a
                  href="https://github.com/soos3d/universal-accounts-connectkit-demo/blob/main/ua-conneckit/app/components/UniversalTransfer.tsx"
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

        {/* Inputs */}
        <div className="grid grid-cols-1 gap-3 w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <p className="text-sm text-gray-300 mb-2">Amount (USDC)</p>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value.trim())}
                placeholder="e.g. 12.34"
                className="w-full px-4 py-2 bg-[#1A1A2A] border border-[#4A4A6A] rounded-md text-gray-200 placeholder-gray-500 focus:outline-none"
                inputMode="decimal"
              />
            </div>

            {/* Wallet Toggle */}
            <div className="flex items-center justify-between p-3 bg-[#1A1A2A] rounded-lg border border-[#4A4A6A] h-[42px] self-end">
              <div className="flex items-center gap-1">
                <span className="text-sm font-medium text-gray-200">
                  Wallet Modal
                </span>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <HelpCircle className="h-4 w-4 text-gray-400 cursor-help" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[220px] bg-[#2A2A4A] text-gray-200 border border-[#4A4A6A]">
                      This enables you to access the underlying EOA connected to
                      the Universal Account via Particle Wallet
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Switch
                checked={isWalletVisible}
                onCheckedChange={toggleWalletVisibility}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={runTransaction}
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-lg font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Transferring..." : "Send USDC"}
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
                createUniversalTransaction
              </code>
              ,
              <br />
              <code className="bg-[#1A1A2A] px-1 py-0.5 rounded text-purple-300 mx-1">
                sendTransaction
              </code>
            </p>
            <a
              href="https://developers.particle.network/universal-accounts/ua-reference/desktop/web#sending-a-custom-payable-transaction"
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
