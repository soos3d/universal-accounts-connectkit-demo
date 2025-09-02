import { UniversalAccount } from "@particle-network/universal-account-sdk";

/**
 * Deposit module for Universal Accounts
 * Handles deposit-related functionality
 */

/**
 * Format an address for display by truncating the middle
 * @param address The address to format
 * @param chars Number of characters to show at start and end
 * @returns Formatted address string
 */
export const formatAddress = (address: string, chars = 6): string => {
  if (!address) return "";
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
};

/**
 * Get deposit addresses for a Universal Account
 * @param universalAccount The Universal Account instance
 * @returns Object containing EVM and Solana addresses
 */
export const getDepositAddresses = async (universalAccount: UniversalAccount) => {
  if (!universalAccount) {
    throw new Error("Universal Account is not initialized");
  }
  
  const options = await universalAccount.getSmartAccountOptions();
  
  return {
    evmSmartAccount: options.smartAccountAddress || "",
    solanaSmartAccount: options.solanaSmartAccountAddress || "",
  };
};

/**
 * Copy text to clipboard with feedback
 * @param text Text to copy
 * @param callback Optional callback function to execute after copying
 */
export const copyToClipboard = async (
  text: string,
  callback?: (copied: boolean) => void
): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    if (callback) callback(true);
  } catch (error) {
    console.error("Failed to copy to clipboard:", error);
    if (callback) callback(false);
  }
};
