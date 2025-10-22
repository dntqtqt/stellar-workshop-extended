# Stellar Crowdfunding Workshop

A full-stack workshop project for building a decentralized crowdfunding platform on the Stellar blockchain. This project combines a modern React frontend with a Rust/Soroban smart contract backend, designed for educational purposes at the Stellar Indonesia Workshop (October 2025).

## Project Structure

```
crowdfunding/   # React + TypeScript frontend (Vite, React Router, TailwindCSS)
ezcrow/         # Rust + Soroban smart contracts for Stellar
```

### Frontend (`crowdfunding/`)

- Built with React, TypeScript, Vite, and TailwindCSS
- Uses React Router for routing and SSR
- Integrates with Stellar wallets and SDK
- Hot Module Replacement for fast development

#### Quick Start

```bash
cd crowdfunding
npm install
npm run dev
# Visit http://localhost:5173
```

#### Build & Deploy

- Production build: `npm run build`
- Docker support: `docker build -t my-app . && docker run -p 3000:3000 my-app`

### Smart Contracts (`ezcrow/`)

- Rust smart contracts using Soroban SDK for Stellar
- Main contract: `contracts/crowdfunding`
- Features: campaign creation, donations, goal/deadline logic, storage, and more

#### Quick Start

```bash
cd ezcrow/contracts/crowdfunding
make build      # Build contract
make test       # Run tests
# See README.md in this folder for deployment instructions
```

#### Key Concepts

- Campaigns have owners, goals, deadlines
- Anyone can donate; all logic is on-chain
- Learn Rust, Soroban, and Stellar development

## Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Examples](https://github.com/stellar/soroban-examples)
- [Risein Platform](https://risein.com/)
- [BlockDevId Community](https://blockdev.id/)
- [Workshop Documentation (Blockdev x RiseIn x Stellar) ](https://blockdev-stellar.pages.dev)

---

Built for the Stellar Indonesia Workshop by Risein & BlockDevId. Happy building! 🚀🇮🇩
