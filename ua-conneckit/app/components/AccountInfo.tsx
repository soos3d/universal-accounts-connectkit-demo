'use client';

import { useAccount, useWallets } from '@particle-network/connectkit';
import { useEffect, useState } from 'react';

export default function AccountInfo() {
  const { address, isConnected } = useAccount();
  const [wallets] = useWallets();
  const [balance, setBalance] = useState<string | null>(null);
  const [chainName, setChainName] = useState<string | null>(null);

  useEffect(() => {
    if (isConnected && address && wallets) {
      // Get chain information
      if (wallets.chainId) {
        // For simplicity, we'll just use the chainId to determine the network name
        const networkNames: Record<number, string> = {
          1: 'Ethereum Mainnet',
          5: 'Goerli Testnet',
          11155111: 'Sepolia Testnet',
          137: 'Polygon',
          80001: 'Mumbai Testnet',
          42161: 'Arbitrum One',
          421613: 'Arbitrum Goerli',
        };
        
        setChainName(networkNames[wallets.chainId] || `Chain ID: ${wallets.chainId}`);
      }

      // Get balance (simplified example)
      const fetchBalance = async () => {
        try {
          const walletClient = wallets.getWalletClient();
          if (walletClient) {
            // Using public client for read operations instead
            // This is a workaround for TypeScript type issues
            const balanceHex = await fetch(`https://eth-mainnet.g.alchemy.com/v2/demo/getBalance?address=${address}`)
              .then(res => res.json())
              .then(data => data.result)
              .catch(() => '0x0');
            
            // Convert from wei to ETH (simplified)
            const balanceInWei = BigInt(balanceHex as string);
            const balanceInEth = Number(balanceInWei) / 1e18;
            setBalance(balanceInEth.toFixed(4));
          }
        } catch (error) {
          console.error('Error fetching balance:', error);
        }
      };

      fetchBalance();
    } else {
      setBalance(null);
      setChainName(null);
    }
  }, [isConnected, address, wallets]);

  if (!isConnected || !address) {
    return null;
  }

  return (
    <div className="mt-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Account Information</h2>
      
      <div className="space-y-3">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Address</p>
          <p className="font-mono break-all">{address}</p>
        </div>
        
        {chainName && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Network</p>
            <p>{chainName}</p>
          </div>
        )}
        
        {balance && (
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Balance</p>
            <p>{balance} ETH</p>
          </div>
        )}
      </div>
    </div>
  );
}
