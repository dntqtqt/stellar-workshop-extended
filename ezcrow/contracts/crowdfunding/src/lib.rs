#![no_std]
use soroban_sdk::{contract, contractimpl, symbol_short, token, Address, Env, Map, Symbol};

// Storage keys for our contract data
const CAMPAIGN_GOAL: Symbol = symbol_short!("goal");
const CAMPAIGN_DEADLINE: Symbol = symbol_short!("deadline");
const TOTAL_RAISED: Symbol = symbol_short!("raised");
const DONATIONS: Symbol = symbol_short!("donations");
const CAMPAIGN_OWNER: Symbol = symbol_short!("owner");
const XLM_TOKEN_ADDRESS: Symbol = symbol_short!("xlm_addr");
const IS_ALREADY_INIT: Symbol = symbol_short!("is_init");

// Main contract struct
#[contract]
pub struct CrowdfundingContract;

// Contract implementation
#[contractimpl]
impl CrowdfundingContract {
    // Initialize the crowdfunding campaign
    pub fn initialize(
        env: Env,
        owner: Address,     // Campaign creator's address
        goal: i128,         // Target amount (in stroops: 1 XLM = 10,000,000 stroops)
        deadline: u64,      // Unix timestamp when campaign ends
        xlm_token: Address, // XLM token contract address
    ) {
        // Verify the owner is who they claim to be
        owner.require_auth();

        // Store campaign settings
        env.storage().instance().set(&CAMPAIGN_OWNER, &owner);
        env.storage().instance().set(&CAMPAIGN_GOAL, &goal);
        env.storage().instance().set(&CAMPAIGN_DEADLINE, &deadline);
        env.storage().instance().set(&TOTAL_RAISED, &0i128);
        env.storage().instance().set(&XLM_TOKEN_ADDRESS, &xlm_token);
        
        // Set initialization flag to true
        env.storage().instance().set(&IS_ALREADY_INIT, &true);

        // Initialize empty donations map
        let donations: Map<Address, i128> = Map::new(&env);
        env.storage().instance().set(&DONATIONS, &donations);
    }

    // Make a donation to the campaign
    pub fn donate(env: Env, donor: Address, amount: i128) {
        // Verify the donor is authorized
        donor.require_auth();

        // Check if campaign is still active
        let deadline: u64 = env.storage().instance().get(&CAMPAIGN_DEADLINE).unwrap();
        if env.ledger().timestamp() > deadline {
            panic!("Campaign has ended");
        }

        // Validate donation amount
        if amount <= 0 {
            panic!("Donation amount must be positive");
        }

        // Get the XLM token address from storage and contract address
        let xlm_token_address: Address = env.storage().instance().get(&XLM_TOKEN_ADDRESS).unwrap();
        let xlm_token = token::Client::new(&env, &xlm_token_address);
        let contract_address = env.current_contract_address();

        // Transfer XLM from donor to this contract
        xlm_token.transfer(&donor, &contract_address, &amount);

        // Update total raised
        let mut total: i128 = env.storage().instance().get(&TOTAL_RAISED).unwrap();
        total += amount;
        env.storage().instance().set(&TOTAL_RAISED, &total);

        // Track individual donor's contribution
        let mut donations: Map<Address, i128> = env.storage().instance().get(&DONATIONS).unwrap();
        let current_donation = donations.get(donor.clone()).unwrap_or(0);
        donations.set(donor, current_donation + amount);
        env.storage().instance().set(&DONATIONS, &donations);
    }

    // Get the total amount raised so far
    pub fn get_total_raised(env: Env) -> i128 {
        env.storage().instance().get(&TOTAL_RAISED).unwrap_or(0)
    }

    // Get how much a specific donor has contributed
    pub fn get_donation(env: Env, donor: Address) -> i128 {
        let donations: Map<Address, i128> = env.storage().instance().get(&DONATIONS).unwrap();
        donations.get(donor).unwrap_or(0)
    }

    // Get initialization status - for frontend to check if contract is initialized
    pub fn get_is_already_init(env: Env) -> bool {
        env.storage().instance().get(&IS_ALREADY_INIT).unwrap_or(false)
    }
}

#[cfg(test)]
mod test;
