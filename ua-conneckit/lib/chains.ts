import { CHAIN_ID } from "@particle-network/universal-account-sdk";

export interface Chain {
  name: string
  icon: string
  id: string
  chainId: CHAIN_ID
}

export const supportedChains: Chain[] = [
  {
    name: "Solana",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fsolana%2Ficons%2F101.png&w=32&q=75",
    id: "solana",
    chainId: CHAIN_ID.SOLANA_MAINNET
  },
  {
    name: "Ethereum",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F1.png&w=32&q=75",
    id: "ethereum",
    chainId: CHAIN_ID.ETHEREUM_MAINNET
  },
  {
    name: "BNB Chain",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F56.png&w=32&q=75",
    id: "bnb_chain",
    chainId: CHAIN_ID.BSC_MAINNET
  },
  {
    name: "Base",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F8453.png&w=32&q=75",
    id: "base",
    chainId: CHAIN_ID.BASE_MAINNET
  },
  {
    name: "Arbitrum",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F42161.png&w=32&q=75",
    id: "arbitrum",
    chainId: CHAIN_ID.ARBITRUM_MAINNET_ONE
  },
  {
    name: "Avalanche",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F43114.png&w=32&q=75",
    id: "avalanche",
    chainId: CHAIN_ID.AVALANCHE_MAINNET
  },
  {
    name: "Optimism",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F10.png&w=32&q=75",
    id: "optimism",
    chainId: CHAIN_ID.OPTIMISM_MAINNET
  },
  {
    name: "Polygon",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F137.png&w=32&q=75",
    id: "polygon",
    chainId: CHAIN_ID.POLYGON_MAINNET
  },
  {
    name: "HyperEVM",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F999.png&w=32&q=75",
    id: "hyper-evm",
    chainId: 999 as CHAIN_ID
  },
  {
    name: "Berachain",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F80094.png&w=32&q=75",
    id: "berachain",
    chainId: CHAIN_ID.BERACHAIN_MAINNET
  },
  {
    name: "Linea",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F59144.png&w=32&q=75",
    id: "linea",
    chainId: CHAIN_ID.LINEA_MAINNET
  },
  {
    name: "Sonic",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F146.png&w=32&q=75",
    id: "sonic",
    chainId: CHAIN_ID.SONIC_MAINNET
  },
  {
    name: "Merlin",
    icon: "https://universalx.app/_next/image?url=https%3A%2F%2Fstatic.particle.network%2Fchains%2Fevm%2Ficons%2F4200.png&w=32&q=75",
    id: "merlin",
    chainId: CHAIN_ID.MERLIN_MAINNET
  },
];
