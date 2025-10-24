#![no_std]
use soroban_sdk::{
    contract, contractimpl, symbol_short, token, Address, Env, Map, String, Symbol, Vec,
};

// Storage keys for our contract data
const CAMPAIGN_GOAL: Symbol = symbol_short!("goal");
const CAMPAIGN_DEADLINE: Symbol = symbol_short!("deadline");
const TOTAL_RAISED: Symbol = symbol_short!("raised");
const DONATIONS: Symbol = symbol_short!("donations");
const CAMPAIGN_OWNER: Symbol = symbol_short!("owner");
const XLM_TOKEN_ADDRESS: Symbol = symbol_short!("xlm_addr");
const IS_ALREADY_INIT: Symbol = symbol_short!("is_init");
const CAMPAIGN_TITLE: Symbol = symbol_short!("title");
const CAMPAIGN_DESC: Symbol = symbol_short!("desc");
const CAMPAIGN_IMAGE: Symbol = symbol_short!("image");
const MIN_DONATION: Symbol = symbol_short!("min_don");
const CAMPAIGN_STATUS: Symbol = symbol_short!("status");
const WITHDRAWN: Symbol = symbol_short!("withdrawn");

// Campaign status enum
#[derive(Clone, Copy, PartialEq)]
pub enum CampaignStatus {
    Active = 0,
    Successful = 1,
    Failed = 2,
    Withdrawn = 3,
}

// Main contract struct
#[contract]
pub struct CrowdfundingContract;

// Contract implementation
#[contractimpl]
impl CrowdfundingContract {
    // Initialize the crowdfunding campaign with enhanced metadata
    pub fn initialize(
        env: Env,
        owner: Address,      // Campaign creator's address
        goal: i128,          // Target amount (in stroops: 1 XLM = 10,000,000 stroops)
        deadline: u64,       // Unix timestamp when campaign ends
        xlm_token: Address,  // XLM token contract address
        title: String,       // Campaign title
        description: String, // Campaign description
        image_url: String,   // Campaign image URL
        min_donation: i128,  // Minimum donation amount in stroops
    ) {
        // Verify the owner is who they claim to be
        owner.require_auth();

        // Validate inputs
        if goal <= 0 {
            panic!("Goal must be positive");
        }
        if deadline <= env.ledger().timestamp() {
            panic!("Deadline must be in the future");
        }
        if min_donation < 0 {
            panic!("Minimum donation cannot be negative");
        }

        // Store campaign settings
        env.storage().instance().set(&CAMPAIGN_OWNER, &owner);
        env.storage().instance().set(&CAMPAIGN_GOAL, &goal);
        env.storage().instance().set(&CAMPAIGN_DEADLINE, &deadline);
        env.storage().instance().set(&TOTAL_RAISED, &0i128);
        env.storage().instance().set(&XLM_TOKEN_ADDRESS, &xlm_token);
        env.storage().instance().set(&CAMPAIGN_TITLE, &title);
        env.storage().instance().set(&CAMPAIGN_DESC, &description);
        env.storage().instance().set(&CAMPAIGN_IMAGE, &image_url);
        env.storage().instance().set(&MIN_DONATION, &min_donation);
        env.storage()
            .instance()
            .set(&CAMPAIGN_STATUS, &(CampaignStatus::Active as u32));
        env.storage().instance().set(&WITHDRAWN, &false);

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

        // Check campaign status
        let status: u32 = env.storage().instance().get(&CAMPAIGN_STATUS).unwrap();
        if status != CampaignStatus::Active as u32 {
            panic!("Campaign is not active");
        }

        // Validate donation amount
        if amount <= 0 {
            panic!("Donation amount must be positive");
        }

        // Check minimum donation requirement
        let min_donation: i128 = env.storage().instance().get(&MIN_DONATION).unwrap();
        if amount < min_donation {
            panic!("Donation below minimum amount");
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

        // Check if goal is reached and update status
        let goal: i128 = env.storage().instance().get(&CAMPAIGN_GOAL).unwrap();
        if total >= goal {
            env.storage()
                .instance()
                .set(&CAMPAIGN_STATUS, &(CampaignStatus::Successful as u32));
        }

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
        env.storage()
            .instance()
            .get(&IS_ALREADY_INIT)
            .unwrap_or(false)
    }

    // Get campaign details
    pub fn get_campaign_info(env: Env) -> (Address, i128, u64, String, String, String, i128, u32) {
        let owner: Address = env.storage().instance().get(&CAMPAIGN_OWNER).unwrap();
        let goal: i128 = env.storage().instance().get(&CAMPAIGN_GOAL).unwrap();
        let deadline: u64 = env.storage().instance().get(&CAMPAIGN_DEADLINE).unwrap();
        let title: String = env.storage().instance().get(&CAMPAIGN_TITLE).unwrap();
        let description: String = env.storage().instance().get(&CAMPAIGN_DESC).unwrap();
        let image: String = env.storage().instance().get(&CAMPAIGN_IMAGE).unwrap();
        let min_donation: i128 = env.storage().instance().get(&MIN_DONATION).unwrap();
        let status: u32 = env.storage().instance().get(&CAMPAIGN_STATUS).unwrap();

        (
            owner,
            goal,
            deadline,
            title,
            description,
            image,
            min_donation,
            status,
        )
    }

    // Get campaign status
    pub fn get_campaign_status(env: Env) -> u32 {
        env.storage()
            .instance()
            .get(&CAMPAIGN_STATUS)
            .unwrap_or(CampaignStatus::Active as u32)
    }

    // Withdraw funds (only for successful campaigns and by owner)
    pub fn withdraw(env: Env, owner: Address) {
        // Verify the owner is authorized
        owner.require_auth();

        // Check if caller is the campaign owner
        let campaign_owner: Address = env.storage().instance().get(&CAMPAIGN_OWNER).unwrap();
        if owner != campaign_owner {
            panic!("Only campaign owner can withdraw");
        }

        // Check if already withdrawn
        let withdrawn: bool = env.storage().instance().get(&WITHDRAWN).unwrap_or(false);
        if withdrawn {
            panic!("Funds already withdrawn");
        }

        // Check campaign status - must be successful or deadline passed
        let status: u32 = env.storage().instance().get(&CAMPAIGN_STATUS).unwrap();
        let deadline: u64 = env.storage().instance().get(&CAMPAIGN_DEADLINE).unwrap();
        let current_time = env.ledger().timestamp();

        if status != CampaignStatus::Successful as u32 && current_time <= deadline {
            panic!("Campaign must be successful or deadline must have passed");
        }

        // Update status if deadline passed but not failed yet
        if current_time > deadline && status == CampaignStatus::Active as u32 {
            let total: i128 = env.storage().instance().get(&TOTAL_RAISED).unwrap();
            let goal: i128 = env.storage().instance().get(&CAMPAIGN_GOAL).unwrap();
            if total >= goal {
                env.storage()
                    .instance()
                    .set(&CAMPAIGN_STATUS, &(CampaignStatus::Successful as u32));
            } else {
                env.storage()
                    .instance()
                    .set(&CAMPAIGN_STATUS, &(CampaignStatus::Failed as u32));
                panic!("Campaign failed to reach goal");
            }
        }

        // Get contract balance and transfer to owner
        let total_raised: i128 = env.storage().instance().get(&TOTAL_RAISED).unwrap();
        if total_raised > 0 {
            let xlm_token_address: Address =
                env.storage().instance().get(&XLM_TOKEN_ADDRESS).unwrap();
            let xlm_token = token::Client::new(&env, &xlm_token_address);
            let contract_address = env.current_contract_address();

            xlm_token.transfer(&contract_address, &owner, &total_raised);
        }

        // Mark as withdrawn
        env.storage().instance().set(&WITHDRAWN, &true);
        env.storage()
            .instance()
            .set(&CAMPAIGN_STATUS, &(CampaignStatus::Withdrawn as u32));
    }

    // Request refund (only for failed campaigns)
    pub fn refund(env: Env, donor: Address) {
        // Verify the donor is authorized
        donor.require_auth();

        // Check if campaign has failed
        let deadline: u64 = env.storage().instance().get(&CAMPAIGN_DEADLINE).unwrap();
        let current_time = env.ledger().timestamp();
        let status: u32 = env.storage().instance().get(&CAMPAIGN_STATUS).unwrap();

        // Update status if deadline passed
        if current_time > deadline && status == CampaignStatus::Active as u32 {
            let total: i128 = env.storage().instance().get(&TOTAL_RAISED).unwrap();
            let goal: i128 = env.storage().instance().get(&CAMPAIGN_GOAL).unwrap();
            if total >= goal {
                env.storage()
                    .instance()
                    .set(&CAMPAIGN_STATUS, &(CampaignStatus::Successful as u32));
            } else {
                env.storage()
                    .instance()
                    .set(&CAMPAIGN_STATUS, &(CampaignStatus::Failed as u32));
            }
        }

        // Check if campaign failed
        let updated_status: u32 = env.storage().instance().get(&CAMPAIGN_STATUS).unwrap();
        if updated_status != CampaignStatus::Failed as u32 {
            panic!("Refunds only available for failed campaigns");
        }

        // Get donor's contribution
        let donations: Map<Address, i128> = env.storage().instance().get(&DONATIONS).unwrap();
        let donation_amount = donations.get(donor.clone()).unwrap_or(0);

        if donation_amount <= 0 {
            panic!("No donation found for this address");
        }

        // Transfer refund
        let xlm_token_address: Address = env.storage().instance().get(&XLM_TOKEN_ADDRESS).unwrap();
        let xlm_token = token::Client::new(&env, &xlm_token_address);
        let contract_address = env.current_contract_address();

        xlm_token.transfer(&contract_address, &donor, &donation_amount);

        // Remove donor from donations map and update total
        let mut updated_donations = donations;
        updated_donations.remove(donor);
        env.storage().instance().set(&DONATIONS, &updated_donations);

        let mut total: i128 = env.storage().instance().get(&TOTAL_RAISED).unwrap();
        total -= donation_amount;
        env.storage().instance().set(&TOTAL_RAISED, &total);
    }

    // Get all donors (returns addresses and amounts)
    pub fn get_all_donors(env: Env) -> Vec<(Address, i128)> {
        let donations: Map<Address, i128> = env
            .storage()
            .instance()
            .get(&DONATIONS)
            .unwrap_or(Map::new(&env));
        let mut donors = Vec::new(&env);

        for (addr, amount) in donations.iter() {
            donors.push_back((addr, amount));
        }

        donors
    }

    // Get campaign progress percentage (0-10000 for 0.00% to 100.00%)
    pub fn get_progress_percentage(env: Env) -> u32 {
        let total: i128 = env.storage().instance().get(&TOTAL_RAISED).unwrap_or(0);
        let goal: i128 = env.storage().instance().get(&CAMPAIGN_GOAL).unwrap_or(1);

        if goal <= 0 {
            return 0;
        }

        let percentage = (total * 10000) / goal;
        if percentage > 10000 {
            10000 // Cap at 100%
        } else {
            percentage as u32
        }
    }

    // Check if campaign deadline has passed
    pub fn is_deadline_passed(env: Env) -> bool {
        let deadline: u64 = env
            .storage()
            .instance()
            .get(&CAMPAIGN_DEADLINE)
            .unwrap_or(0);
        env.ledger().timestamp() > deadline
    }

    // Get minimum donation amount
    pub fn get_min_donation(env: Env) -> i128 {
        env.storage().instance().get(&MIN_DONATION).unwrap_or(0)
    }
}

#[cfg(test)]
mod test;
