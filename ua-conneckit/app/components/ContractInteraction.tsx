"use client";

import { useState } from "react";
import "./animations.css";
import {
  UniversalAccount,
  CHAIN_ID,
} from "@particle-network/universal-account-sdk";
import { Interface } from "ethers";
import { Button } from "../../components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";

interface ContractInteractionProps {
  universalAccountInstance: UniversalAccount | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletClient: any;
  address: string | undefined;
}

export default function ContractInteraction({
  universalAccountInstance,
  walletClient,
  address,
}: ContractInteractionProps) {
  const [txResult, setTxResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showDetails, setShowDetails] = useState<boolean>(false);

  const runTransaction = async () => {
    if (!universalAccountInstance) return;
    setIsLoading(true);
    setTxResult(null);

    const CONTRACT_ADDRESS = "0x0287f57A1a17a725428689dfD9E65ECA01d82510"; // NFT contract on Polygon

    try {
      const contractInterface = new Interface(["function mint() external"]);

      const transaction =
        await universalAccountInstance.createUniversalTransaction({
          chainId: CHAIN_ID.POLYGON_MAINNET,
          expectTokens: [],
          transactions: [
            {
              to: CONTRACT_ADDRESS,
              data: contractInterface.encodeFunctionData("mint"),
              //  value: "0x0",
            },
          ],
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
      console.error("Transaction failed:", error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      setTxResult(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-200 border-b border-[#4A4A6A] pb-2 text-center">
        Smart Contract Interaction
      </h3>
      <div className="bg-[#2A2A4A] rounded-lg p-6 border border-[#4A4A6A] shadow-inner flex flex-col items-center gap-4 hover:border-purple-500 transition-colors">
        <div className="w-full mb-2">
          <div className="flex justify-between items-center">
            <h4 className="text-lg font-medium text-purple-300">
              Mint NFT on Polygon
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
                This example demonstrates how to interact with smart contracts
                using Universal Accounts SDK. The transaction will mint an NFT
                on Polygon Mainnet using tokens the user holds in their UA, even
                if they are not on Polygon.
              </p>
              <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                <span>Contract: 0x...2510</span>
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
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                  View Code on GitHub
                </a>
              </div>
            </div>
          )}
        </div>
        
        <div className="w-full mt-4">
          <p className="text-sm text-gray-300 mb-2">NFT Collection</p>
          <div className="w-full px-4 py-2 bg-[#1A1A2A] border border-[#4A4A6A] rounded-md text-gray-400 focus:outline-none">
            Particle Demo NFT
          </div>
        </div>

        <Button
          onClick={runTransaction}
          disabled={isLoading}
          className="w-full py-3 px-6 rounded-lg font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Minting..." : "Mint NFT"}
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
        </div>
      </div>
    </div>
  );
}
