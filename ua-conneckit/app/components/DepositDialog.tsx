"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
/* eslint-disable @next/next/no-img-element */
import { ArrowDownToLine, Copy, Network } from "lucide-react";
import { useState } from "react";
import { supportedChains } from "../../lib/chains";
import { formatAddress, copyToClipboard } from "../../lib/deposit";

// Using formatAddress from deposit module instead of local truncateAddress function

interface DepositDialogProps {
  showDepositDialog: boolean;
  setShowDepositDialog: (show: boolean) => void;
  evmAddress: string;
  solanaAddress: string;
}

// Address block component to fix the useState in callback issue
const AddressBlock = ({ label, value }: { label: string; value: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await copyToClipboard(value, (success) => {
      if (success) {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      }
    });
  };

  return (
    <div
      key={label}
      className="bg-[#2A2A4A] rounded-lg px-3 py-2 flex justify-between items-center"
    >
      <div className="text-sm font-medium text-gray-200 max-w-[75%] truncate">
        <span className="font-semibold">{label}:</span> {formatAddress(value)}
      </div>
      <div className="relative">
        <Button
          onClick={handleCopy}
          variant="ghost"
          size="icon"
          className="text-[#C084FC] hover:text-purple-400"
        >
          <Copy className="w-4 h-4" />
        </Button>
        {copied && (
          <div className="absolute -top-7 right-0 text-xs bg-gray-800 text-white px-2 py-1 rounded shadow">
            Copied!
          </div>
        )}
      </div>
    </div>
  );
};

export default function DepositDialog({
  showDepositDialog,
  setShowDepositDialog,
  evmAddress,
  solanaAddress,
}: DepositDialogProps) {
  return (
    <Dialog open={showDepositDialog} onOpenChange={setShowDepositDialog}>
      <DialogContent className="p-4 max-w-sm bg-[#1F1F3A] rounded-xl border border-[#4A4A6A] text-gray-200">
        <DialogHeader className="mb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
              <ArrowDownToLine className="w-4 h-4 text-white" />
            </div>
            <DialogTitle className="text-base font-semibold text-[#C084FC]">
              Deposit Assets
            </DialogTitle>
          </div>
        </DialogHeader>

        {/* Networks */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
            <Network className="w-4 h-4 text-[#C084FC]" />
            Supported Networks
          </div>
          <p className="text-xs text-gray-400 leading-tight">
            Use the EVM UA for EVM assets or Solana UA for Solana assets.
          </p>
          <div className="grid grid-cols-5 gap-x-2 gap-y-3 pt-2">
            {supportedChains.map((chain) => (
              <div
                key={chain.name}
                className="flex flex-col items-center justify-center"
              >
                <img
                  src={chain.icon}
                  alt={chain.name}
                  className="w-6 h-6 rounded-full border"
                />
                <span className="text-[9px] text-center text-gray-300 leading-tight mt-1">
                  {chain.name}
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 leading-tight p-2">
            Deposit <strong>USDC, USDT, ETH, BNB, SOL, BTC</strong> to your
            universal account.
          </p>
          <p className="text-xs text-gray-400 leading-tight p-2">
            After depositing, you can use your universal account to interact
            with the app.
          </p>
        </div>

        {/* Address Blocks */}
        <div className="space-y-2 mb-4">
          <AddressBlock label="EVM UA" value={evmAddress} />
          <AddressBlock label="Solana UA" value={solanaAddress} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
