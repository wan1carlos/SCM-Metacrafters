# Blockchain Project Voting System

A decentralized application (DApp) that enables users to vote on blockchain project proposals. Built with Solidity, Hardhat, Ethers.js, and Next.js.

## Overview

This DApp allows users to participate in voting for different blockchain projects. It features special privileges for the contract owner while maintaining voting restrictions for regular users. The system comes pre-loaded with three innovative blockchain project proposals.

## Features

- **Secure Voting System**: One vote per address for regular users
- **Owner Privileges**: Contract owner can vote multiple times
- **Real-time Updates**: Instant vote count updates
- **MetaMask Integration**: Seamless wallet connection
- **Responsive Design**: Works on all device sizes
- **User-friendly Interface**: Clean and intuitive UI

## Project Proposals

1. **Eco-friendly Marketplace**
   - A sustainable marketplace for eco-friendly products

2. **DeFi Lending Platform**
   - Decentralized lending platform with competitive rates

3. **NFT Gaming Platform**
   - Gaming platform with NFT integration and rewards

## Technology Stack

- **Smart Contracts**: Solidity
- **Development Environment**: Hardhat
- **Frontend Framework**: Next.js
- **Blockchain Interaction**: Ethers.js
- **Wallet Connection**: MetaMask
- **Styling**: CSS Modules

## Prerequisites

- Node.js (v14+ recommended)
- MetaMask browser extension
- Git

## Setup Instructions

1. Clone the repository
2. Install dependencies: `npm install`
3. Start local Hardhat node: `npx hardhat node`
4. Deploy contracts: `npx hardhat run scripts/deploy.js --network localhost`
5. Start frontend: `npm run dev`

## Usage

1. Connect MetaMask to localhost network
2. Connect wallet through the DApp interface
3. View available projects
4. Cast votes for preferred projects
5. View real-time vote counts

## Project Structure

- `/contracts`: Smart contract source code
- `/scripts`: Deployment scripts
- `/pages`: Next.js pages and components
- `/styles`: CSS modules for styling
- `/public`: Static assets

## Security Features

- Vote validation
- Address verification
- Owner privilege management
- Transaction confirmation
- Error handling

## Future Enhancements

- Multiple voting categories
- Time-based voting periods
- Vote delegation
- Project submission system
- Advanced analytics

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenZeppelin for smart contract best practices
- Hardhat development environment
- Next.js documentation
- Ethereum community

## Contact

**Github**: [wan1carlos](https://github.com/wan1carlos)
