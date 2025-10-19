# Crowdfunding Smart Contract - Stellar Soroban

A simple crowdfunding smart contract for Stellar blockchain using Soroban + Rust. Perfect for beginners and workshops! 🚀

**Created for: Stellar Indonesia Workshop by Risein & BlockDevId**  
📅 October 18-19, 2025 | 📍 South Jakarta | 🇮🇩

> This is a beginner-friendly project designed for the workshop. The code is intentionally simple with clear comments to help you learn Rust and Soroban smart contract development!

## 📋 Overview

This contract allows you to create crowdfunding campaigns where:

- A campaign owner sets a funding goal and deadline
- Anyone can donate to the campaign
- Track total donations and individual contributions
- Check if the goal is reached

## 🎯 Learning Objectives

By building and deploying this contract, you'll learn:

- ✅ How to write smart contracts in Rust
- ✅ Understanding Soroban SDK basics
- ✅ Storage management on blockchain
- ✅ Authorization and security patterns
- ✅ Testing smart contracts
- ✅ Deploying to Stellar Testnet

## 🏗️ Contract Features (MVP - Minimum Viable Product)

### Core Functions (Implemented):

1. **initialize()** - Set up campaign with goal and deadline
2. **donate()** - Accept contributions from donors
3. **get_total_raised()** - View total amount raised
4. **get_donation()** - Check specific donor's contribution

### 🎓 Exercise Functions (For Students to Implement):

Students will practice by adding these features:

5. **get_goal()** - Return campaign goal amount
6. **get_deadline()** - Return campaign deadline
7. **is_goal_reached()** - Check if goal is met
8. **is_ended()** - Check if campaign ended
9. **get_progress_percentage()** - Calculate % of goal reached
10. **refund()** - Challenge: Allow refunds if goal not met

> **Learning Note**: The contract is intentionally simple! Advanced features are left as exercises to help you learn by doing. Check the code comments for implementation hints!

## 🔧 Prerequisites

- Rust installed (https://rustup.rs/)
- Stellar CLI installed (`cargo install stellar-cli`)
- Soroban SDK

## 🚀 Build & Test

### Build the contract:
```bash
make build
# or
stellar contract build
```

### Run tests:
```bash
make test
# or
cargo test
```

### Clean build artifacts:
```bash
make clean
```

## 📱 Frontend Integration Guide

Here's what your frontend needs to pass to each contract function:

### 1. **Initialize Campaign**
```javascript
// Function: initialize
// Parameters:
{
  owner: "GXXXXXX...",        // Address: Campaign creator's Stellar address
  goal: 1000000000,           // i128: Goal amount in stroops (100 XLM = 1,000,000,000 stroops)
  deadline: 1735689600        // u64: Unix timestamp (seconds since epoch)
}
```

### 2. **Make a Donation**
```javascript
// Function: donate
// Parameters:
{
  donor: "GXXXXXX...",        // Address: Donor's Stellar address
  amount: 100000000           // i128: Donation amount in stroops (10 XLM = 100,000,000 stroops)
}
```

### 3. **Get Total Raised**
```javascript
// Function: get_total_raised
// Parameters: None
// Returns: i128 (total amount in stroops)
```

### 4. **Get Donation by Address**
```javascript
// Function: get_donation
// Parameters:
{
  donor: "GXXXXXX..."         // Address: Donor's Stellar address
}
// Returns: i128 (amount donated by this address)
```

---

## 🎓 Student Exercise Functions

Once you implement these functions in the contract, here's how the frontend will call them:

### 5. **Get Campaign Goal** (Exercise)
```javascript
// Function: get_goal
// Parameters: None
// Returns: i128 (goal amount in stroops)
```

### 6. **Get Campaign Deadline** (Exercise)
```javascript
// Function: get_deadline
// Parameters: None
// Returns: u64 (Unix timestamp)
```

### 7. **Check if Goal Reached** (Exercise)
```javascript
// Function: is_goal_reached
// Parameters: None
// Returns: bool (true if goal reached, false otherwise)
```

### 8. **Check if Campaign Ended** (Exercise)
```javascript
// Function: is_ended
// Parameters: None
// Returns: bool (true if past deadline, false otherwise)
```

## 💡 Important Notes

### About Stroops
- 1 XLM = 10,000,000 stroops
- Always use stroops (smallest unit) in the contract
- Example: To set a goal of 100 XLM, pass `1000000000` (100 * 10,000,000)

### About Timestamps
- Use Unix timestamps (seconds since January 1, 1970)
- JavaScript: `Math.floor(Date.now() / 1000)` gives current timestamp
- For 24 hours from now: `Math.floor(Date.now() / 1000) + 86400`

### Authorization
- The `owner` must authorize the `initialize` call
- Each `donor` must authorize their `donate` call
- This is handled by Stellar wallets (like Freighter)

## 🧪 Deploy to Stellar Testnet

### 1. Configure Stellar CLI for Testnet
```bash
stellar network add \
  --global testnet \
  --rpc-url https://soroban-testnet.stellar.org:443 \
  --network-passphrase "Test SDF Network ; September 2015"
```

### 2. Create/Configure Identity
```bash
# Generate a new identity
stellar keys generate --global alice --network testnet

# Or import existing secret key
stellar keys add alice --secret-key
```

### 3. Fund Your Account
Visit https://laboratory.stellar.org/#account-creator?network=test and create a funded testnet account.

### 4. Deploy the Contract
```bash
stellar contract deploy \
  --wasm target/wasm32v1-none/release/crowdfunding.wasm \
  --source alice \
  --network testnet
```

This will output your contract ID (e.g., `CXXXXXXXXXX...`). Save this!

### 5. Initialize Your Campaign
```bash
stellar contract invoke \
  --id YOUR_CONTRACT_ID \
  --source alice \
  --network testnet \
  -- initialize \
  --owner GXXXXX_YOUR_ADDRESS \
  --goal 1000000000 \
  --deadline 1735689600
```

## 📖 Example Usage Flow

1. **Owner** deploys and initializes the contract
2. **Donors** call `donate()` to contribute
3. **Anyone** can call view functions to check status
4. Campaign runs until deadline
5. Check if goal was reached with `is_goal_reached()`

## 🎓 Workshop Tips

- Start by explaining stroops (smallest unit of XLM)
- Show how Unix timestamps work
- Run the tests first to see contract behavior
- Deploy to testnet and interact using Stellar CLI
- Build a simple frontend with Stellar SDK

## 📚 Learn More

- [Stellar Documentation](https://developers.stellar.org/)
- [Soroban Examples](https://github.com/stellar/soroban-examples)
- [Soroban SDK Docs](https://docs.rs/soroban-sdk/)

## 🤝 Contributing

This is a learning project! Feel free to:
- Add more features (refund mechanism, milestones, etc.)
- Improve error handling
- Add more tests
- Create a frontend example

Happy coding! 🎉
