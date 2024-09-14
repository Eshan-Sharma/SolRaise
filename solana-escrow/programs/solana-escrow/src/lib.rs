use anchor_lang::prelude::*;

declare_id!("4nahJCS6dMYDAJSUt3TLzFfJA9qbsGp1CFdN7yQCiT4G");

#[program]
pub mod solana_escrow {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize {}
