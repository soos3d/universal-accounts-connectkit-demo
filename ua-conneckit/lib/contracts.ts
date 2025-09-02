import { UniversalAccount, CHAIN_ID } from "@particle-network/universal-account-sdk";
import { Interface } from "ethers";

// Define types for transaction results
type TransactionResult = {
  success: boolean;
  transactionId?: string;
  explorerUrl?: string;
  error?: string;
};

/**
 * Smart Contract Interaction module for Universal Accounts
 * Handles contract calls and transaction execution
 */

/**
 * Execute a smart contract transaction using Universal Account
 * @param universalAccount - The Universal Account instance
 * @param walletClient - The wallet client for signing (must have signMessage method)
 * @param ownerAddress - The owner's address
 * @param options - Transaction options
 * @returns Transaction result with ID or error
 */
export const executeTransaction = async (
  universalAccount: UniversalAccount,
  // Using any here because the WalletClient type from ConnectKit is not directly importable
  // but we document the expected interface in JSDoc
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletClient: any, 
  ownerAddress: string,
  options: {
    contractAddress: string;
    chainId: CHAIN_ID;
    functionName: string;
    functionInterface: string[];
    functionArgs?: unknown[];
    value?: string;
  }
): Promise<TransactionResult> => {
  if (!universalAccount) {
    throw new Error("Universal Account is not initialized");
  }

  if (!walletClient) {
    throw new Error("Wallet client is not available");
  }

  try {
    const contractInterface = new Interface(options.functionInterface);
    
    // Encode function data with arguments if provided
    const data = options.functionArgs 
      ? contractInterface.encodeFunctionData(options.functionName, options.functionArgs)
      : contractInterface.encodeFunctionData(options.functionName);

    // Create the transaction
    const transaction = await universalAccount.createUniversalTransaction({
      chainId: options.chainId,
      expectTokens: [],
      transactions: [
        {
          to: options.contractAddress,
          data,
          value: options.value || "0x0",
        },
      ],
    });

    // Sign the transaction with the wallet
    const signature = await walletClient.signMessage({
      account: ownerAddress as `0x${string}`,
      message: { raw: transaction.rootHash },
    });

    // Send the transaction
    const result = await universalAccount.sendTransaction(transaction, signature);

    return {
      success: true,
      transactionId: result.transactionId,
      explorerUrl: `https://universalx.app/activity/details?id=${result.transactionId}`,
    };
  } catch (error) {
    console.error("Transaction failed:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
};

/**
 * Mint an NFT using a predefined contract
 * @param universalAccount - The Universal Account instance
 * @param walletClient - The wallet client for signing (must have signMessage method)
 * @param ownerAddress - The owner's address
 * @returns Transaction result
 */
export const mintNFT = async (
  universalAccount: UniversalAccount,
  // Using any here because the WalletClient type from ConnectKit is not directly importable
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  walletClient: any,
  ownerAddress: string
): Promise<TransactionResult> => {
  // NFT contract on Polygon
  const CONTRACT_ADDRESS = "0x0287f57A1a17a725428689dfD9E65ECA01d82510";
  
  return executeTransaction(
    universalAccount,
    walletClient,
    ownerAddress,
    {
      contractAddress: CONTRACT_ADDRESS,
      chainId: CHAIN_ID.POLYGON_MAINNET,
      functionName: "mint",
      functionInterface: ["function mint() external"],
    }
  );
};
