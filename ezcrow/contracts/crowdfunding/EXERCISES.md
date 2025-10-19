# 🎓 Student Exercises - Crowdfunding Contract

Welcome to the hands-on exercises! The contract has the core functionality, but you'll add more features to practice Rust and Soroban.

---

## 📝 Current Contract (Already Implemented)

✅ **initialize()** - Create campaign  
✅ **donate()** - Make donation  
✅ **get_total_raised()** - View total raised  
✅ **get_donation()** - View donor's contribution

---

## 🎯 Exercise 1: Get Campaign Goal (Easy)

**Task**: Implement a function that returns the campaign goal.

**Hints**:
```rust
pub fn get_goal(env: Env) -> i128 {
    // TODO: Get CAMPAIGN_GOAL from storage and return it
    // Use: env.storage().instance().get(&CAMPAIGN_GOAL)
    // Return 0 if not found using .unwrap_or(0)
}
```

**Test it**:
```rust
#[test]
fn test_get_goal() {
    let env = Env::default();
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);
    
    let owner = Address::generate(&env);
    let goal = 100_000_000i128;
    let deadline = env.ledger().timestamp() + 86400;
    
    env.mock_all_auths();
    client.initialize(&owner, &goal, &deadline);
    
    // Test your function
    assert_eq!(client.get_goal(), goal);
}
```

---

## 🎯 Exercise 2: Get Campaign Deadline (Easy)

**Task**: Implement a function that returns when the campaign ends.

**Hints**:
```rust
pub fn get_deadline(env: Env) -> u64 {
    // TODO: Get CAMPAIGN_DEADLINE from storage
    // Return type is u64 (unsigned 64-bit integer for timestamps)
}
```

**Test it**:
```rust
#[test]
fn test_get_deadline() {
    let env = Env::default();
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);
    
    let owner = Address::generate(&env);
    let goal = 100_000_000i128;
    let deadline = env.ledger().timestamp() + 86400;
    
    env.mock_all_auths();
    client.initialize(&owner, &goal, &deadline);
    
    assert_eq!(client.get_deadline(), deadline);
}
```

---

## 🎯 Exercise 3: Check if Goal Reached (Medium)

**Task**: Return `true` if total raised >= goal, `false` otherwise.

**Hints**:
```rust
pub fn is_goal_reached(env: Env) -> bool {
    // TODO: 
    // 1. Get total_raised from storage
    // 2. Get goal from storage
    // 3. Return true if total_raised >= goal
    
    let total: i128 = // ... get TOTAL_RAISED
    let goal: i128 = // ... get CAMPAIGN_GOAL
    
    total >= goal
}
```

**Test it**:
```rust
#[test]
fn test_is_goal_reached() {
    let env = Env::default();
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);
    
    let owner = Address::generate(&env);
    let donor = Address::generate(&env);
    let goal = 50_000_000i128;
    let deadline = env.ledger().timestamp() + 86400;
    
    env.mock_all_auths();
    client.initialize(&owner, &goal, &deadline);
    
    // Should be false initially
    assert_eq!(client.is_goal_reached(), false);
    
    // Donate the full goal amount
    client.donate(&donor, &goal);
    
    // Should be true now
    assert_eq!(client.is_goal_reached(), true);
}
```

---

## 🎯 Exercise 4: Check if Campaign Ended (Medium)

**Task**: Return `true` if current time > deadline.

**Hints**:
```rust
pub fn is_ended(env: Env) -> bool {
    // TODO:
    // 1. Get deadline from storage
    // 2. Get current timestamp: env.ledger().timestamp()
    // 3. Compare them
    
    let deadline: u64 = // ... get CAMPAIGN_DEADLINE
    let now: u64 = env.ledger().timestamp();
    
    now > deadline
}
```

**Test it**:
```rust
#[test]
fn test_is_ended() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);
    
    let owner = Address::generate(&env);
    let goal = 100_000_000i128;
    let deadline = env.ledger().timestamp() + 100;
    
    client.initialize(&owner, &goal, &deadline);
    
    // Should not be ended yet
    assert_eq!(client.is_ended(), false);
    
    // Fast forward time past deadline
    env.ledger().with_mut(|li| {
        li.timestamp = deadline + 1;
    });
    
    // Should be ended now
    assert_eq!(client.is_ended(), true);
}
```

---

## 🎯 Exercise 5: Calculate Progress Percentage (Hard)

**Task**: Return what percentage of the goal has been raised (0-100).

**Hints**:
```rust
pub fn get_progress_percentage(env: Env) -> i128 {
    // TODO:
    // 1. Get total_raised
    // 2. Get goal
    // 3. Calculate: (total_raised * 100) / goal
    // 4. Handle edge case: what if goal is 0?
    
    let total: i128 = // ... get TOTAL_RAISED
    let goal: i128 = // ... get CAMPAIGN_GOAL
    
    if goal == 0 {
        return 0;  // Avoid division by zero!
    }
    
    (total * 100) / goal
}
```

**Test it**:
```rust
#[test]
fn test_progress_percentage() {
    let env = Env::default();
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);
    
    let owner = Address::generate(&env);
    let donor = Address::generate(&env);
    let goal = 100_000_000i128;  // 10 XLM
    let deadline = env.ledger().timestamp() + 86400;
    
    env.mock_all_auths();
    client.initialize(&owner, &goal, &deadline);
    
    // Donate 50% of goal
    client.donate(&donor, &50_000_000);
    
    // Should be 50%
    assert_eq!(client.get_progress_percentage(), 50);
    
    // Donate another 25%
    client.donate(&donor, &25_000_000);
    
    // Should be 75%
    assert_eq!(client.get_progress_percentage(), 75);
}
```

---

## 🎯 BONUS Exercise: Refund Function (Challenge! 🔥)

**Task**: Allow donors to get their money back IF:
- Campaign has ended (past deadline)
- Goal was NOT reached

**Hints**:
```rust
pub fn refund(env: Env, donor: Address) -> i128 {
    // TODO:
    // 1. Verify donor authorization
    // 2. Check campaign has ended
    // 3. Check goal NOT reached
    // 4. Get donor's donation amount
    // 5. Subtract from total_raised
    // 6. Remove donor from donations map
    // 7. Return the refund amount
    
    donor.require_auth();
    
    // Check if campaign ended
    let deadline: u64 = env.storage().instance().get(&CAMPAIGN_DEADLINE).unwrap();
    if env.ledger().timestamp() <= deadline {
        panic!("Campaign still active");
    }
    
    // Check if goal NOT reached
    let total: i128 = env.storage().instance().get(&TOTAL_RAISED).unwrap();
    let goal: i128 = env.storage().instance().get(&CAMPAIGN_GOAL).unwrap();
    if total >= goal {
        panic!("Goal was reached, no refunds");
    }
    
    // Get donation amount
    let mut donations: Map<Address, i128> = env.storage()
        .instance()
        .get(&DONATIONS)
        .unwrap();
    let amount = donations.get(donor.clone()).unwrap_or(0);
    
    if amount == 0 {
        panic!("No donation to refund");
    }
    
    // Update total
    let new_total = total - amount;
    env.storage().instance().set(&TOTAL_RAISED, &new_total);
    
    // Remove donor
    donations.remove(donor.clone());
    env.storage().instance().set(&DONATIONS, &donations);
    
    amount
}
```

**Test it**:
```rust
#[test]
fn test_refund_when_goal_not_reached() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);
    
    let owner = Address::generate(&env);
    let donor = Address::generate(&env);
    let goal = 100_000_000i128;
    let deadline = env.ledger().timestamp() + 100;
    
    client.initialize(&owner, &goal, &deadline);
    
    // Donate less than goal
    client.donate(&donor, &30_000_000);
    
    // Fast forward past deadline
    env.ledger().with_mut(|li| {
        li.timestamp = deadline + 1;
    });
    
    // Should be able to refund
    let refund_amount = client.refund(&donor);
    assert_eq!(refund_amount, 30_000_000);
    
    // Total should be 0 now
    assert_eq!(client.get_total_raised(), 0);
}

#[test]
#[should_panic(expected = "Goal was reached, no refunds")]
fn test_refund_fails_when_goal_reached() {
    let env = Env::default();
    env.mock_all_auths();
    
    let contract_id = env.register(CrowdfundingContract, ());
    let client = CrowdfundingContractClient::new(&env, &contract_id);
    
    let owner = Address::generate(&env);
    let donor = Address::generate(&env);
    let goal = 50_000_000i128;
    let deadline = env.ledger().timestamp() + 100;
    
    client.initialize(&owner, &goal, &deadline);
    
    // Donate full goal
    client.donate(&donor, &goal);
    
    // Fast forward past deadline
    env.ledger().with_mut(|li| {
        li.timestamp = deadline + 1;
    });
    
    // Should panic - goal was reached
    client.refund(&donor);
}
```

---

## 📚 Learning Tips

1. **Start with Exercise 1** - It's the easiest and teaches you storage basics
2. **Copy the pattern** - Look at existing functions like `get_total_raised()`
3. **Test as you go** - Run `cargo test` after each function
4. **Read the errors** - Rust compiler gives helpful hints
5. **Ask for help** - Instructors are here to support you!

---

## ✅ How to Verify Your Work

After implementing each function:

```bash
# Run all tests
cargo test

# Run a specific test
cargo test test_get_goal

# Run with output
cargo test -- --nocapture
```

---

## 🎉 Completion Checklist

- [ ] Exercise 1: get_goal() implemented and tested
- [ ] Exercise 2: get_deadline() implemented and tested
- [ ] Exercise 3: is_goal_reached() implemented and tested
- [ ] Exercise 4: is_ended() implemented and tested
- [ ] Exercise 5: get_progress_percentage() implemented and tested
- [ ] BONUS: refund() implemented and tested (optional)

---

## 🚀 Next Steps After Completion

1. Deploy your contract to Stellar Testnet
2. Build a simple frontend to interact with it
3. Add more features (owner withdrawal, multiple campaigns, etc.)
4. Share your work with the community!

---

**Good luck! You got this! 💪**

*Need help? Check WHY_I128.md for deep dives, or ask your instructors!*
