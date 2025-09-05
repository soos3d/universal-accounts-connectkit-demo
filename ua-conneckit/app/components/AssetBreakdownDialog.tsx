import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { IAssetsResponse } from "@particle-network/universal-account-sdk";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { supportedChains } from "../../lib/chains";
import { dummyTokens } from "../../lib/tokens";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
/* eslint-disable @next/next/no-img-element */

interface AssetBreakdownDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  assets: IAssetsResponse | null;
}

// ChainIcon component
interface ChainIconProps {
  chainId: number;
  size?: number;
}

const ChainIcon: React.FC<ChainIconProps> = ({ chainId, size = 24 }) => {
  // Find the chain in the supportedChains array
  const chain = supportedChains.find((c) => Number(c.chainId) === chainId);

  if (chain) {
    return (
      <img
        src={chain.icon}
        alt={chain.name}
        width={size}
        height={size}
        style={{ borderRadius: "50%" }}
        title={chain.name}
      />
    );
  }

  // Fallback for chains not in the supportedChains list
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        backgroundColor: "#7A7A8C",
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#FFFFFF",
        fontWeight: "bold",
        fontSize: `${size / 2}px`,
      }}
      title={`Chain ${chainId}`}
    >
      {chainId.toString().substring(0, 1)}
    </div>
  );
};

// Helper function to get chain name from chain ID
const getChainName = (chainId: number): string => {
  const chain = supportedChains.find((c) => Number(c.chainId) === chainId);
  return chain ? chain.name : `Chain ${chainId}`;
};

// Format amount with appropriate decimals
const formatAmount = (amount: number): string => {
  if (amount === 0) return "0";
  if (amount < 0.00001) return "<0.00001";
  return amount.toFixed(5);
};

// Format USD amount
const formatUSD = (amount: number): string => {
  if (amount === 0) return "$0.00";
  if (amount < 0.01) return "<$0.01";
  return `$${amount.toFixed(2)}`;
};

// Helper function to get token info
const getTokenInfo = (tokenType: string) => {
  const token = dummyTokens.find((t) => t.id === tokenType.toLowerCase());
  return {
    name: token?.name || tokenType.toUpperCase(),
    symbol: token?.symbol || tokenType.toUpperCase(),
    icon: token?.icon || "",
  };
};

const AssetBreakdownDialog: React.FC<AssetBreakdownDialogProps> = ({
  isOpen,
  setIsOpen,
  assets,
}) => {
  if (!assets) return null;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-hidden bg-[#1F1F3A] border border-[#4A4A6A] text-gray-200">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-center text-[#C084FC]">
            Asset Breakdown
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 overflow-y-auto max-h-[70vh] pr-1">
          <div className="flex justify-between items-center mb-6">
            <div className="flex gap-3">
              <a
                href="https://developers.particle.network/universal-accounts/ua-reference/desktop/web#fetch-primary-assets"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-[#3A3A5A] hover:bg-[#4A4A7A] rounded-md transition-colors text-purple-400 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
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
              <a
                href="https://github.com/soos3d/universal-accounts-connectkit-demo/blob/main/ua-conneckit/app/components/AssetBreakdownDialog.tsx"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 bg-[#3A3A5A] hover:bg-[#4A4A7A] rounded-md transition-colors text-purple-400 text-sm"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77A5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                GitHub
              </a>
            </div>
            <h3 className="ml-6 text-lg font-medium text-gray-200">
              Total Balance: {formatUSD(assets.totalAmountInUSD)}
            </h3>
          </div>

          <Tabs defaultValue="by-asset" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-[#2A2A4A]">
              <TabsTrigger value="by-asset">By Asset</TabsTrigger>
              <TabsTrigger value="by-chain">By Chain</TabsTrigger>
            </TabsList>

            {/* By Asset Tab */}
            <TabsContent value="by-asset" className="mt-4">
              <div className="space-y-4">
                {assets.assets
                  .filter((asset) => asset.amount > 0)
                  .map((asset) => (
                    <div
                      key={asset.tokenType}
                      className="bg-[#2A2A4A] rounded-lg p-4 border border-[#4A4A6A]"
                    >
                      <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                          {getTokenInfo(asset.tokenType).icon ? (
                            <img
                              src={getTokenInfo(asset.tokenType).icon}
                              alt={getTokenInfo(asset.tokenType).symbol}
                              className="w-8 h-8 rounded-full"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-[#3A3A5A] flex items-center justify-center uppercase font-bold text-white">
                              {asset.tokenType.substring(0, 1)}
                            </div>
                          )}
                          <span className="text-lg font-medium text-gray-200">
                            {getTokenInfo(asset.tokenType).name}
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-lg font-semibold text-gray-200">
                            {formatAmount(asset.amount)}{" "}
                            {asset.tokenType.toUpperCase()}
                          </div>
                          <div className="text-sm text-gray-400">
                            {formatUSD(asset.amountInUSD)}
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 border-t border-[#4A4A6A] pt-3">
                        <DropdownMenu>
                          <DropdownMenuTrigger className="flex justify-between items-center w-full py-2 px-3 rounded-md bg-[#3A3A5A] hover:bg-[#4A4A7A] transition-colors">
                            <div className="flex items-center gap-2">
                              <h4 className="text-sm font-medium text-gray-300">
                                Chain Distribution
                              </h4>
                            </div>
                            <ChevronDown className="h-4 w-4 text-gray-400" />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="bg-[#2A2A4A] border border-[#4A4A6A] text-gray-200 w-[calc(100%-24px)] max-w-none mx-3">
                            <div className="space-y-2 p-2 max-h-48">
                              {asset.chainAggregation
                                .filter((chain) => chain.amount > 0)
                                .map((chain) => (
                                  <div
                                    key={`${asset.tokenType}-${chain.token.chainId}`}
                                    className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-[#3A3A5A]"
                                  >
                                    <div className="flex items-center gap-2">
                                      <ChainIcon
                                        chainId={chain.token.chainId}
                                      />
                                      <span className="text-sm text-gray-300">
                                        {getChainName(chain.token.chainId)}
                                      </span>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-sm font-medium text-gray-200">
                                        {formatAmount(chain.amount)}
                                      </div>
                                      <div className="text-xs text-gray-400">
                                        {formatUSD(chain.amountInUSD)}
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              {asset.chainAggregation.filter(
                                (chain) => chain.amount > 0
                              ).length === 0 && (
                                <div className="text-sm text-gray-400 text-center py-2">
                                  No assets on any chain
                                </div>
                              )}
                            </div>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
              </div>
            </TabsContent>

            {/* By Chain Tab */}
            <TabsContent value="by-chain" className="mt-4">
              {/* Create a map of chains with their assets */}
              {(() => {
                // Build a map of chains with their assets
                const chainMap: Record<
                  number,
                  {
                    chainId: number;
                    totalValue: number;
                    assets: Array<{
                      tokenType: string;
                      amount: number;
                      amountInUSD: number;
                    }>;
                  }
                > = {};

                // Populate the chain map
                assets.assets.forEach((asset) => {
                  asset.chainAggregation.forEach((chain) => {
                    // Only include chains with assets > 0
                    if (chain.amount > 0) {
                      if (!chainMap[chain.token.chainId]) {
                        chainMap[chain.token.chainId] = {
                          chainId: chain.token.chainId,
                          totalValue: 0,
                          assets: [],
                        };
                      }

                      chainMap[chain.token.chainId].assets.push({
                        tokenType: asset.tokenType,
                        amount: chain.amount,
                        amountInUSD: chain.amountInUSD,
                      });

                      chainMap[chain.token.chainId].totalValue +=
                        chain.amountInUSD;
                    }
                  });
                });

                // Sort chains by total value
                const sortedChains = Object.values(chainMap).sort(
                  (a, b) => b.totalValue - a.totalValue
                );

                return (
                  <div className="space-y-4">
                    {sortedChains.length > 0 ? (
                      sortedChains.map((chain) => (
                        <div
                          key={chain.chainId}
                          className="bg-[#2A2A4A] rounded-lg p-4 border border-[#4A4A6A]"
                        >
                          <div className="flex justify-between items-center mb-3">
                            <div className="flex items-center gap-2">
                              <ChainIcon chainId={chain.chainId} />
                              <span className="text-lg font-medium text-gray-200">
                                {getChainName(chain.chainId)}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="text-lg font-semibold text-gray-200">
                                {formatUSD(chain.totalValue)}
                              </div>
                            </div>
                          </div>

                          <div className="mt-2 border-t border-[#4A4A6A] pt-3">
                            <DropdownMenu>
                              <DropdownMenuTrigger className="flex justify-between items-center w-full py-2 px-3 rounded-md bg-[#3A3A5A] hover:bg-[#4A4A7A] transition-colors">
                                <div className="flex items-center gap-2">
                                  <h4 className="text-sm font-medium text-gray-300">
                                    Assets
                                  </h4>
                                </div>
                                <ChevronDown className="h-4 w-4 text-gray-400" />
                              </DropdownMenuTrigger>
                              <DropdownMenuContent className="bg-[#2A2A4A] border border-[#4A4A6A] text-gray-200 w-[calc(100%-24px)] max-w-none mx-3">
                                <div className="space-y-2 p-2 max-h-48">
                                  {chain.assets.map((asset) => (
                                    <div
                                      key={`${chain.chainId}-${asset.tokenType}`}
                                      className="flex justify-between items-center py-1.5 px-2 rounded-md hover:bg-[#3A3A5A]"
                                    >
                                      <div className="flex items-center gap-2">
                                        {getTokenInfo(asset.tokenType).icon ? (
                                          <img
                                            src={
                                              getTokenInfo(asset.tokenType).icon
                                            }
                                            alt={
                                              getTokenInfo(asset.tokenType)
                                                .symbol
                                            }
                                            className="w-6 h-6 rounded-full"
                                          />
                                        ) : (
                                          <div className="w-6 h-6 rounded-full bg-[#3A3A5A] flex items-center justify-center uppercase font-bold text-white text-xs">
                                            {asset.tokenType.substring(0, 1)}
                                          </div>
                                        )}
                                        <span className="text-sm text-gray-300">
                                          {getTokenInfo(asset.tokenType).symbol}
                                        </span>
                                      </div>
                                      <div className="text-right">
                                        <div className="text-sm font-medium text-gray-200">
                                          {formatAmount(asset.amount)}
                                        </div>
                                        <div className="text-xs text-gray-400">
                                          {formatUSD(asset.amountInUSD)}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-400">
                        No assets found on any chain
                      </div>
                    )}
                  </div>
                );
              })()}
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssetBreakdownDialog;
