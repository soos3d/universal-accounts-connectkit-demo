"use client";

import { useState } from "react";
import "./animations.css";
import {
  UniversalAccount,
  CHAIN_ID,
} from "@particle-network/universal-account-sdk";
import { ChevronDown, ChevronUp } from "lucide-react";

interface SendFundsProps {
  universalAccountInstance: UniversalAccount | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletClient: any;
  address: string | undefined;
}

const SendFunds = ({
  universalAccountInstance,
  walletClient,
  address,
}: SendFundsProps) => {
  const [showDetails, setShowDetails] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [txResult, setTxResult] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");

  const sendTransaction = async () => {
    if (!universalAccountInstance || !address) {
      setTxResult("Error: Universal Account or wallet address not available");
      return;
    }

    setIsLoading(true);
    setTxResult(null);

    const usdcArbContract = "0xaf88d065e77c8cC2239327C5EDb3A432268e5831"; // USDC on Arbitrum

    try {
      // Create a transaction to send funds to the EOA wallet
      const transaction =
        await universalAccountInstance.createTransferTransaction({
          token: {
            chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE,
            address: usdcArbContract,
          },
          amount: amount, // Amount to send (human-readable string)
          receiver: address, // Target address
        });

      const signature = await walletClient?.signMessage({
        account: address as `0x${string}`,
        message: { raw: transaction.rootHash },
      });

      const result = await universalAccountInstance.sendTransaction(
        transaction,
        signature
      );

      setTxResult(
        `https://universalx.app/activity/details?id=${result.transactionId}`
      );
    } catch (error) {
      console.error("Error sending funds:", error);
      setTxResult(
        `Error: ${error instanceof Error ? error.message : String(error)}`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-200 border-b border-[#4A4A6A] pb-2 text-center">
        Cross-Chain Transfers
      </h3>
      <div className="bg-[#2A2A4A] rounded-lg p-6 border border-[#4A4A6A] shadow-inner flex flex-col items-center gap-4 hover:border-purple-500 transition-colors">
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
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>Network: Arbitrum One</span>
                <a
                  href="https://github.com/particle-network/particle-network-docs/tree/main/demo/universal-accounts"
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

        <div className="w-full mt-4">
          <p className="text-sm text-gray-300 mb-2">Amount (USDC)</p>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="w-full px-4 py-2 bg-[#1A1A2A] border border-[#4A4A6A] rounded-md text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="0.1"
            step="0.1"
            min="0.1"
          />
        </div>

        <button
          onClick={sendTransaction}
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-lg font-bold text-lg text-white bg-[#9333EA] hover:bg-[#8429D8] transition-all duration-300 shadow-lg flex items-center justify-center gap-2 mt-4"
        >
          <svg
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5"
          >
            <path
              d="M12 5L12 19"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M19 12L12 19L5 12"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {isLoading ? "Sending..." : "Send Funds"}
        </button>

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
          <p className="text-xs text-gray-400">
            <span className="font-medium text-gray-300">
              SDK Functions Used:
            </span>
            <br />
            <code className="bg-[#1A1A2A] px-1 py-0.5 rounded text-purple-300 mx-1">
              createTransferTransaction
            </code>
            ,
            <br />
            <code className="bg-[#1A1A2A] px-1 py-0.5 rounded text-purple-300 mx-1">
              sendTransaction
            </code>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SendFunds;
