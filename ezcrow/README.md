# Ezcrow - Stellar Smart Contracts

**Stellar Indonesia Workshop - Risein & BlockDevId**  
📅 October 18-19, 2025 | 📍 South Jakarta, Indonesia 🇮🇩

## About This Workshop

Welcome to the Stellar Indonesia Workshop! 🚀

This workshop is designed for developers and students who want to:
- ✨ Break into blockchain without expensive courses
- 🔧 Build real smart contracts with Rust (Soroban)
- 🌐 Explore Web3 career opportunities
- 🤝 Network with Indonesia's Web3 community

### What You'll Learn:
- Smart contract development with Rust & Soroban
- Deploying to Stellar Testnet
- Real blockchain use cases
- Building decentralized applications

## Project Structure

This repository uses the recommended structure for a Soroban project:
```text
.
├── contracts
│   └── crowdfunding      ← 🎯 Main Workshop Project
│       ├── src
│       │   ├── lib.rs    ← Smart contract code
│       │   └── test.rs   ← Tests
│       ├── Cargo.toml
│       └── README.md     ← Full documentation
├── Cargo.toml
└── README.md
```

## 🎯 Workshop Project: Crowdfunding Contract

The main project for this workshop is a **simple crowdfunding smart contract** that demonstrates:

- ✅ Storage management on blockchain
- ✅ Authorization patterns (who can do what)
- ✅ Time-based logic (deadlines)
- ✅ Token/amount handling
- ✅ Testing smart contracts
- ✅ Deploying to Stellar Testnet

### Getting Started

Navigate to the crowdfunding contract:
```bash
cd contracts/crowdfunding
```

Check the full documentation:
```bash
cat README.md
```

### Quick Start

1. **Build the contract:**
   ```bash
   cd contracts/crowdfunding
   make build
   ```

2. **Run tests:**
   ```bash
   make test
   ```

3. **Deploy to testnet:**
   Follow the deployment guide in `contracts/crowdfunding/README.md`

## 🤔 Common Questions

### Why Rust?
Rust is memory-safe, fast, and perfect for blockchain development. Stellar uses Soroban (Rust SDK) for smart contracts.

### What's Soroban?
Soroban is Stellar's smart contract platform. It uses WebAssembly (WASM) for contracts written in Rust.

## 📚 Additional Resources

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Examples](https://github.com/stellar/soroban-examples)
- [Risein Platform](https://risein.com/) - Free Web3 learning
- [BlockDevId Community](https://blockdev.id/)

## 🙋‍♂️ Workshop Organizers

**Risein**: Free Web3 learning ecosystem for builders worldwide

**BlockDevId**: Indonesia's blockchain developer community

## 💡 After the Workshop

- Join the BlockDevId community
- Continue learning on Risein platform
- Build your own projects
- Deploy to Stellar mainnet
- Share your work with the community

Happy building! 🚀🇮🇩