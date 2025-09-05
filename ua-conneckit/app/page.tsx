/* eslint-disable @next/next/no-img-element */
"use client";
import "./components/animations.css";
import {
  ConnectButton,
  useAccount,
  useWallets,
  useDisconnect,
} from "@particle-network/connectkit";
import { useState, useEffect } from "react";
import {
  Eye,
  Copy,
  Check,
  HelpCircle,
  ArrowDownToLine,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
// Universal Accounts imports
import {
  UniversalAccount,
  type IAssetsResponse,
  //SUPPORTED_TOKEN_TYPE,
} from "@particle-network/universal-account-sdk";
import DepositDialog from "./components/DepositDialog";
import AssetBreakdownDialog from "./components/AssetBreakdownDialog";

// Import components
import ContractInteraction from "./components/ContractInteraction";
import SendFunds from "./components/SendFunds";
import UsdcTransfer from "./components/UniversalTransfer";
import ConvertToUsdc from "./components/Convertions";

// Helper functions
const formatAddress = (addr: string) => {
  if (!addr) return "";
  return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`;
};

const copyToClipboard = (text: string, callback?: () => void) => {
  navigator.clipboard.writeText(text);
  if (callback) callback();
};

const App = () => {
  // Get wallet from Particle Connect
  const [primaryWallet] = useWallets();
  const walletClient = primaryWallet?.getWalletClient();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const [universalAccountInstance, setUniversalAccountInstance] =
    useState<UniversalAccount | null>(null);
  const [accountInfo, setAccountInfo] = useState<{
    ownerAddress: string;
    evmSmartAccount: string;
    solanaSmartAccount: string;
  } | null>(null);

  // State for dialogs
  const [isAddressDialogOpen, setIsAddressDialogOpen] = useState(false);
  const [showDepositDialog, setShowDepositDialog] = useState<boolean>(false);
  const [showDepositDetails, setShowDepositDetails] = useState<boolean>(false);
  const [isAssetBreakdownOpen, setIsAssetBreakdownOpen] = useState<boolean>(false);
  const [tooltipsEnabled, setTooltipsEnabled] = useState(false);

  // Disable tooltips when dialog opens, enable after a delay
  useEffect(() => {
    if (isAddressDialogOpen) {
      setTooltipsEnabled(false);
      const timer = setTimeout(() => {
        setTooltipsEnabled(true);
      }, 1000); // Enable tooltips after 1 second
      return () => clearTimeout(timer);
    }
  }, [isAddressDialogOpen]);

  // Copy address to clipboard with feedback
  const [copiedAddress, setCopiedAddress] = useState<string | null>(null);

  const handleCopyToClipboard = (text: string) => {
    copyToClipboard(text, () => {
      setCopiedAddress(text);
      setTimeout(() => setCopiedAddress(null), 2000);
    });
  };

  // === Initialize UniversalAccount ===
  useEffect(() => {
    if (isConnected && address) {
      // Create new UA instance when user connects
      const ua = new UniversalAccount({
        projectId: process.env.NEXT_PUBLIC_PROJECT_ID!,
        projectClientKey: process.env.NEXT_PUBLIC_CLIENT_KEY!,
        projectAppUuid: process.env.NEXT_PUBLIC_APP_ID!,
        ownerAddress: address,
        rpcUrl: "https://universal-rpc-staging.particle.network",
        // If not set it will use auto-slippage
        tradeConfig: {
          slippageBps: 100, // 1% slippage tolerance
          universalGas: false, // Prioritize PARTI token to pay for gas
          //usePrimaryTokens: [SUPPORTED_TOKEN_TYPE.SOL], // Specify token to use as source
        },
      });
      console.log("UniversalAccount initialized:", ua);
      setUniversalAccountInstance(ua);
    } else {
      // Reset UA when user disconnects
      setUniversalAccountInstance(null);
    }
  }, [isConnected, address]);

  // === Fetch Universal Account Addresses ===
  useEffect(() => {
    if (!universalAccountInstance || !address) return;
    const fetchSmartAccountAddresses = async () => {
      try {
        // Get Universal Account addresses for both EVM and Solana
        const options = await universalAccountInstance.getSmartAccountOptions();
        setAccountInfo({
          ownerAddress: address, // EOA address
          evmSmartAccount: options.smartAccountAddress || "", // EVM Universal Account
          solanaSmartAccount: options.solanaSmartAccountAddress || "", // Solana Universal Account
        });
        console.log("Universal Account Options:", options);
      } catch (error) {
        console.error("Failed to fetch smart account addresses:", error);
      }
    };
    fetchSmartAccountAddresses();
  }, [universalAccountInstance, address]);

  // Aggregated balance across all chains
  const [primaryAssets, setPrimaryAssets] = useState<IAssetsResponse | null>(
    null
  );
  // Transaction state is now handled in the ContractInteraction component

  // === Fetch Primary Assets ===
  useEffect(() => {
    if (!universalAccountInstance || !address) return;
    const fetchPrimaryAssets = async () => {
      // Get aggregated balance across all chains
      // This includes ETH, USDC, USDT, etc. on various chains
      const assets = await universalAccountInstance.getPrimaryAssets();
      console.log("Primary Assets:", assets);
      setPrimaryAssets(assets);
    };
    fetchPrimaryAssets();
  }, [universalAccountInstance, address]);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#0A0A1A] to-[#1A0A2A] p-6 font-sans overflow-hidden">
      {/* Particle background effect */}
      <div
        className="absolute inset-0 z-0 opacity-30"
        style={{
          background:
            "radial-gradient(circle at 20% 80%, #8B5CF6 0%, transparent 30%), radial-gradient(circle at 80% 20%, #FACC15 0%, transparent 30%)",
        }}
      ></div>

      <div className="relative z-10 w-full max-w-5xl mx-auto bg-[#1F1F3A]/80 rounded-xl shadow-2xl p-8 space-y-8 border border-[#3A3A5A] backdrop-blur-sm">
        {/* Header Section */}
        <div className="flex justify-center items-center mb-8 border-b border-[#3A3A5A] pb-6">
          <h1 className="text-4xl font-bold text-[#C084FC] drop-shadow-lg">
            Universal Account with Particle Connect
          </h1>
        </div>

        {isConnected && (
          <div className="w-full max-w-4xl mx-auto space-y-8">
            {/* Main Content Grid - Account Details Button and Balance side by side */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left Column - Account Details Button */}
              <div>
                <div className="flex flex-col gap-3">
                  {/* Account Details Button */}
                  <Dialog
                    open={isAddressDialogOpen}
                    onOpenChange={setIsAddressDialogOpen}
                  >
                    <DialogTrigger asChild>
                      <button className="w-full bg-[#2A2A4A] rounded-lg p-6 border border-[#4A4A6A] shadow-inner hover:border-purple-500 transition-colors flex flex-col items-center justify-center gap-2">
                        <div className="flex items-center gap-2">
                          <Eye className="h-5 w-5 text-gray-300" />
                          <span className="text-xl font-semibold text-gray-200">
                            View Account Details
                          </span>
                        </div>
                        {address && (
                          <span className="text-sm text-gray-400">
                            {formatAddress(address as string)}
                          </span>
                        )}
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md bg-[#1F1F3A] border border-[#4A4A6A] text-gray-200">
                      <DialogHeader>
                        <DialogTitle className="text-xl font-semibold text-center text-[#C084FC]">
                          Account Addresses
                        </DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-1 gap-4 mt-4">
                        {/* Wallet Address */}
                        <div className="bg-[#2A2A4A] rounded-lg p-5 border border-[#4A4A6A] shadow-inner">
                          <div className="text-sm text-gray-300 font-medium mb-2 flex items-center gap-2">
                            Wallet Address
                            {tooltipsEnabled ? (
                              <TooltipProvider>
                                <Tooltip delayDuration={300}>
                                  <TooltipTrigger asChild>
                                    <button className="inline-flex items-center justify-center rounded-full cursor-help">
                                      <HelpCircle className="h-4 w-4 text-gray-400" />
                                    </button>
                                  </TooltipTrigger>
                                  <TooltipContent
                                    side="right"
                                    className="bg-[#1F1F3A] text-gray-200 border border-[#4A4A6A] max-w-xs"
                                  >
                                    <p>
                                      EOA the user used to login. This is the
                                      owner of the universal account.
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            ) : (
                              <button className="inline-flex items-center justify-center rounded-full cursor-help">
                                <HelpCircle className="h-4 w-4 text-gray-400" />
                              </button>
                            )}
                          </div>
                          <div className="font-mono text-gray-200 text-sm break-all bg-[#1F1F3A] p-3 rounded-md flex justify-between items-center gap-2">
                            <span className="overflow-auto">
                              {address as string}
                            </span>
                            <button
                              onClick={() =>
                                handleCopyToClipboard(address as string)
                              }
                              className="p-1.5 rounded-full hover:bg-[#3A3A5A] transition-colors flex-shrink-0"
                            >
                              {copiedAddress === address ? (
                                <Check className="h-4 w-4 text-green-400" />
                              ) : (
                                <Copy className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </div>

                        {/* EVM Universal Account */}
                        {accountInfo && (
                          <div className="bg-[#2A2A4A] rounded-lg p-5 border border-[#4A4A6A] shadow-inner">
                            <div className="text-sm text-gray-300 font-medium mb-2 flex items-center gap-2">
                              EVM Universal Account Address
                              {tooltipsEnabled ? (
                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <button className="inline-flex items-center justify-center rounded-full cursor-help">
                                        <HelpCircle className="h-4 w-4 text-gray-400" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="right"
                                      className="bg-[#1F1F3A] text-gray-200 border border-[#4A4A6A] max-w-xs"
                                    >
                                      <p>
                                        This is the EVM universal account. This
                                        and the SOL address lead to the same
                                        account and balance, but this is used to
                                        deposit EVM assets on EVM chains.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <button className="inline-flex items-center justify-center rounded-full cursor-help">
                                  <HelpCircle className="h-4 w-4 text-gray-400" />
                                </button>
                              )}
                            </div>
                            <div className="font-mono text-gray-200 text-sm break-all bg-[#1F1F3A] p-3 rounded-md flex justify-between items-center gap-2">
                              <span className="overflow-auto">
                                {accountInfo.evmSmartAccount}
                              </span>
                              <button
                                onClick={() =>
                                  handleCopyToClipboard(
                                    accountInfo.evmSmartAccount
                                  )
                                }
                                className="p-1.5 rounded-full hover:bg-[#3A3A5A] transition-colors flex-shrink-0"
                              >
                                {copiedAddress ===
                                accountInfo.evmSmartAccount ? (
                                  <Check className="h-4 w-4 text-green-400" />
                                ) : (
                                  <Copy className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}

                        {/* SOL Universal Account */}
                        {accountInfo && (
                          <div className="bg-[#2A2A4A] rounded-lg p-5 border border-[#4A4A6A] shadow-inner">
                            <div className="text-sm text-gray-300 font-medium mb-2 flex items-center gap-2">
                              SOL Universal Account Address
                              {tooltipsEnabled ? (
                                <TooltipProvider>
                                  <Tooltip delayDuration={300}>
                                    <TooltipTrigger asChild>
                                      <button className="inline-flex items-center justify-center rounded-full cursor-help">
                                        <HelpCircle className="h-4 w-4 text-gray-400" />
                                      </button>
                                    </TooltipTrigger>
                                    <TooltipContent
                                      side="right"
                                      className="bg-[#1F1F3A] text-gray-200 border border-[#4A4A6A] max-w-xs"
                                    >
                                      <p>
                                        This is the Solana universal account.
                                        This and the EVM address lead to the
                                        same account and balance, but this is
                                        used to deposit assets on Solana.
                                      </p>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              ) : (
                                <button className="inline-flex items-center justify-center rounded-full cursor-help">
                                  <HelpCircle className="h-4 w-4 text-gray-400" />
                                </button>
                              )}
                            </div>
                            <div className="font-mono text-gray-200 text-sm break-all bg-[#1F1F3A] p-3 rounded-md flex justify-between items-center gap-2">
                              <span className="overflow-auto">
                                {accountInfo.solanaSmartAccount}
                              </span>
                              <button
                                onClick={() =>
                                  handleCopyToClipboard(
                                    accountInfo.solanaSmartAccount
                                  )
                                }
                                className="p-1.5 rounded-full hover:bg-[#3A3A5A] transition-colors flex-shrink-0"
                              >
                                {copiedAddress ===
                                accountInfo.solanaSmartAccount ? (
                                  <Check className="h-4 w-4 text-green-400" />
                                ) : (
                                  <Copy className="h-4 w-4 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  {/* Logout Button */}
                  <button
                    onClick={() => disconnect()}
                    className="w-full bg-[#2A2A4A] rounded-lg p-3 border border-[#4A4A6A] shadow-inner hover:border-red-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <span className="text-red-500 font-medium">Log Out</span>
                  </button>
                </div>
              </div>

              {/* Right Column - Universal Balance Section */}
              <div>
                <button 
                  onClick={() => setIsAssetBreakdownOpen(true)}
                  className="w-full bg-[#2A2A4A] rounded-lg p-6 border border-[#4A4A6A] shadow-inner hover:border-yellow-500 transition-colors h-full flex flex-col justify-center"
                >
                  <div className="text-sm text-gray-300 font-medium text-center">
                    Universal Balance
                  </div>
                  <p className="text-4xl font-bold text-[#FACC15] mt-3 text-center">
                    ${primaryAssets?.totalAmountInUSD.toFixed(4) || "0.00"}
                  </p>
                  <div className="text-xs text-gray-400 mt-3 text-center">
                    Click to view asset breakdown
                  </div>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-gray-200 border-b border-[#4A4A6A] pb-2 text-center">
                Cross-Chain Deposits
              </h3>
              <div className="bg-[#2A2A4A] rounded-lg p-6 border border-[#4A4A6A] shadow-inner flex flex-col items-center gap-4 hover:border-purple-500 transition-colors">
                <div className="w-full mb-2">
                  <div className="flex justify-between items-center">
                    <h4 className="text-lg font-medium text-purple-300">
                      Deposit to Universal Account
                    </h4>
                    <button
                      onClick={() => setShowDepositDetails(!showDepositDetails)}
                      className="text-purple-300 hover:text-purple-400 transition-colors"
                      aria-label={
                        showDepositDetails ? "Hide details" : "Show details"
                      }
                    >
                      {showDepositDetails ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </div>

                  {showDepositDetails && (
                    <div className="mt-3 animate-fadeIn">
                      <p className="text-sm text-gray-300 mb-4">
                        This example demonstrates how to deposit assets to your
                        Universal Account across different chains. You can
                        deposit to both EVM and Solana addresses from any
                        wallet.
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
                        <span>Supports multiple chains</span>
                        <a
                          href="https://github.com/soos3d/universal-accounts-connectkit-demo/blob/main/ua-conneckit/app/components/DepositDialog.tsx"
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

                <button
                  onClick={() => setShowDepositDialog(true)}
                  className="w-full py-3 px-6 rounded-lg font-bold text-lg text-white bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 transition-all duration-300 shadow-lg flex items-center justify-center gap-2"
                >
                  <ArrowDownToLine className="w-5 h-5" />
                  Deposit
                </button>

                <div className="w-full mt-2 pt-3 border-t border-[#4A4A6A]">
                  <p className="text-xs text-gray-400">
                    <span className="font-medium text-gray-300">
                      SDK Functions Used:
                    </span>
                    <code className="bg-[#1A1A2A] px-1 py-0.5 rounded text-purple-300 mx-1">
                      getSmartAccountOptions
                    </code>
                  </p>
                </div>
              </div>
            </div>

            {/* Contract Interaction and Send Funds Components */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ContractInteraction
                universalAccountInstance={universalAccountInstance}
                walletClient={walletClient}
                address={address}
              />
              <ConvertToUsdc
                universalAccountInstance={universalAccountInstance}
                walletClient={walletClient}
                address={address}
              />
            </div>

            {/* Universal USDC Transfer and Send Funds Components */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
              <UsdcTransfer
                universalAccountInstance={universalAccountInstance}
                walletClient={walletClient}
                address={address}
              />
              <SendFunds
                universalAccountInstance={universalAccountInstance}
                walletClient={walletClient}
                address={address}
              />
            </div>

            {/* Removed Disconnect Button from here */}
          </div>
        )}

        {!isConnected && (
          <div className="flex flex-col items-center justify-center space-y-6 mt-12 py-12">
            <p className="text-gray-300 text-lg mb-2">
              Connect your wallet to view account details
            </p>
            <div className="w-56">
              <ConnectButton label="Log In" />
            </div>
          </div>
        )}

        {/* Deposit Dialog */}
        {accountInfo && (
          <DepositDialog
            showDepositDialog={showDepositDialog}
            setShowDepositDialog={setShowDepositDialog}
            evmAddress={accountInfo.evmSmartAccount}
            solanaAddress={accountInfo.solanaSmartAccount}
          />
        )}
        
        {/* Asset Breakdown Dialog */}
        <AssetBreakdownDialog
          isOpen={isAssetBreakdownOpen}
          setIsOpen={setIsAssetBreakdownOpen}
          assets={primaryAssets}
        />
      </div>
    </div>
  );
};

export default App;
