use anchor_lang::prelude::*;

#[account]
pub struct Campaign {
    pub creator: Pubkey,
    pub id: u64,
    pub goal_amount: u64,
    pub end_time: i64,
    pub total_funded: u64,
    pub is_active: bool,
    pub bump: u8,
}

impl Campaign {
    pub const LEN: usize = 8 + // discriminator
        32 + // creator (Pubkey)
        8 +  // id (u64)
        8 +  // goal_amount (u64)
        8 +  // end_time (i64)
        8 +  // total_funded (u64)
        1 +  // is_active (bool)
        1; // bump (u8)
}

#[account]
pub struct Donation {
    pub donor: Pubkey,
    pub campaign: Pubkey,
    pub amount: u64,
    pub refunded: bool,
    pub bump: u8,
}

impl Donation {
    pub const LEN: usize = 8 + // discriminator
        32 + // donor (Pubkey)
        32 + // campaign (Pubkey)
        8 +  // amount (u64)
        1 +  // refunded (bool)
        1; // bump (u8)
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, PartialEq, Eq)]
pub enum CampaignStatus {
    Active,
    Successful,
    Failed,
    Canceled,
}

impl Default for CampaignStatus {
    fn default() -> Self {
        CampaignStatus::Active
    }
}
