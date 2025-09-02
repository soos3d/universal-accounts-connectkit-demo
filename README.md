# Universal Accounts with Particle ConnectKit Demo

This demo showcases how to integrate Particle Network's Universal Accounts with ConnectKit to enable cross-chain transactions and smart contract interactions without requiring users to switch networks or hold native tokens on each chain.

> Find more details in the [official documentation](https://developers.particle.network/universal-accounts/cha/overview).

## Overview

The application demonstrates the power of Universal Accounts by allowing users to:

- Connect with Particle ConnectKit via social logins
- View account details (EOA, EVM universal account, Solana universal account)
- Perform cross-chain transfers
- Interact with smart contracts
- Deposit assets to Universal Accounts

## Quickstart

### Prerequisites

- Particle Network project credentials (Project ID, Client Key, App ID)

Find your credentials in the [Particle Network Dashboard](https://dashboard.particle.network/).

### Installation

1. Clone this repository
2. Install dependencies with `yarn install`
3. Create a `.env` file based on `.env.example` with your Particle Network credentials
4. Run the development server with `yarn dev`
5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Key Features

### Universal Account Integration

The demo initializes a Universal Account instance when a user connects their wallet, providing them with:

- An EVM Universal Account address
- A Solana Universal Account address
- Aggregated balance across all chains

### Transaction Functionality

#### Smart Contract Interaction

The application demonstrates how to interact with smart contracts using Universal Accounts:

1. **Mint NFT on Polygon**: Users can mint an NFT on Polygon Mainnet using tokens they hold in their Universal Account, even if those tokens are on different chains.

2. **Transaction Flow**:
   - Creates a universal transaction using `createUniversalTransaction()`
   - Signs the transaction with the user's wallet
   - Sends the transaction using `sendTransaction()`
   - Provides a link to view the transaction on the explorer

#### Cross-Chain Transfers

The application demonstrates how to send funds across chains:

1. **Send USDC to EOA**: Users can send USDC from their Universal Account to their connected EOA wallet on Arbitrum, regardless of which chains their funds are on.

2. **Transaction Flow**:
   - Creates a transfer transaction using `createTransferTransaction()`
   - Signs the transaction with the user's wallet
   - Sends the transaction using `sendTransaction()`
   - Provides a link to view the transaction on the explorer

### Deposit Functionality

Users can deposit assets to their Universal Account from any wallet:

- Supports deposits to both EVM and Solana addresses
- Provides QR codes for easy scanning
- Allows copying of addresses for external transfers
