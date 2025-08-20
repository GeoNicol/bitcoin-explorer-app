# Bitcoin Explorer App

*A comprehensive Bitcoin blockchain explorer built with Next.js and TypeScript*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/geos-projects-e44a3a68/v0-bitcoin-explorer-app)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/Rlm8Nv6HgxO)

## 🚀 Overview

Bitcoin Explorer is a modern, responsive web application that allows users to explore Bitcoin addresses and visualize transaction connections on the blockchain. Similar to popular blockchain explorers like Blockchain.info or Blockchair, this application provides comprehensive insights into Bitcoin transactions and address relationships.

## ✨ Features

### 🔍 Address Search
- **Bitcoin Address Lookup**: Paste any valid Bitcoin address to explore its transaction history
- **Real-time Data**: Fetches live blockchain data using the BlockCypher API
- **Address Validation**: Built-in validation for Bitcoin address formats
- **Example Addresses**: Pre-loaded example addresses for quick testing

### 📊 Transaction Visualization
- **Network Graph**: Visual representation of address connections and transaction flows
- **Interactive Connections**: Click on connected addresses to explore further
- **Color-coded Flows**: Green for incoming transactions, red for outgoing
- **Transaction Amounts**: Display Bitcoin amounts for each connection

### 💰 Address Information
- **Balance Display**: Current Bitcoin balance for any address
- **Transaction Count**: Total number of transactions (sent and received)
- **Transaction History**: Chronological list of recent transactions
- **Confirmation Status**: Real-time confirmation counts for transactions

### 🔍 Transaction Details
- **Detailed Modal**: Click any transaction to view comprehensive details
- **Input/Output Analysis**: Complete breakdown of transaction inputs and outputs
- **Fee Information**: Transaction fees and fee rates
- **Block Information**: Block height, confirmations, and timestamps
- **Hash Links**: Direct links to transaction hashes

## 🛠️ Technical Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **API**: BlockCypher Bitcoin API
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/your-username/bitcoin-explorer-app.git
cd bitcoin-explorer-app
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🔧 API Integration

This application uses the [BlockCypher API](https://www.blockcypher.com/dev/) to fetch Bitcoin blockchain data. The API provides:

- Address information and balances
- Transaction details and history
- Real-time blockchain data
- No authentication required for basic usage

### API Endpoints Used
- `GET /v1/btc/main/addrs/{address}` - Address information
- `GET /v1/btc/main/txs/{hash}` - Transaction details

## 🎯 Usage

1. **Search an Address**: Enter a Bitcoin address in the search field
2. **View Balance**: See the current balance and transaction count
3. **Explore Connections**: Use the network visualization to see connected addresses
4. **Transaction Details**: Click on any transaction for detailed information
5. **Navigate**: Click on connected addresses to explore further

### Example Addresses
Try these well-known Bitcoin addresses:
- `1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa` (Genesis Block)
- `1BvBMSEYstWetqTFn5Au4m4GFg7xJaNVN2` (BitFinex Cold Wallet)

## 🌟 Features in Detail

### Address Visualization
The network graph shows how Bitcoin flows between addresses, making it easy to trace transaction paths and identify patterns in Bitcoin usage.

### Real-time Data
All data is fetched in real-time from the Bitcoin blockchain, ensuring you always see the most current information.

### Responsive Design
The application works seamlessly on desktop, tablet, and mobile devices with a clean, modern interface.

## 🤝 Contributing

This project was built using [v0.app](https://v0.app). To contribute or modify:

1. Visit the [v0 project page](https://v0.app/chat/projects/Rlm8Nv6HgxO)
2. Make changes using the v0 interface
3. Changes will automatically sync to this repository

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🔗 Links

- **Live Demo**: [https://vercel.com/geos-projects-e44a3a68/v0-bitcoin-explorer-app](https://vercel.com/geos-projects-e44a3a68/v0-bitcoin-explorer-app)
- **v0 Project**: [https://v0.app/chat/projects/Rlm8Nv6HgxO](https://v0.app/chat/projects/Rlm8Nv6HgxO)
- **BlockCypher API**: [https://www.blockcypher.com/dev/](https://www.blockcypher.com/dev/)

---

Built with ❤️ using [v0.app](https://v0.app) and deployed on [Vercel](https://vercel.com)
