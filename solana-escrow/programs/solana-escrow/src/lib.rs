use anchor_lang::prelude::*;
use anchor_spl::token::{self, Token, TokenAccount, Transfer};

declare_id!("HqqkyS7miTreeC6qhj4iCPD8cuAtbGgiRbJceCGdF9AB");

#[program]
pub mod crowdfunding_escrow {
    use super::*;

    pub fn initialize_campaign(
        ctx: Context<InitializeCampaign>,
        campaign_id: u64,
        goal_amount: u64,
        duration: i64,
    ) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        campaign.creator = ctx.accounts.creator.key();
        campaign.id = campaign_id;
        campaign.goal_amount = goal_amount;
        campaign.end_time = Clock::get()?.unix_timestamp + duration;
        campaign.total_funded = 0;
        campaign.is_active = true;
        campaign.bump = ctx.bumps.campaign;
        Ok(())
    }

    pub fn donate(ctx: Context<Donate>, amount: u64) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        require!(campaign.is_active, ErrorCode::CampaignInactive);
        require!(
            Clock::get()?.unix_timestamp < campaign.end_time,
            ErrorCode::CampaignEnded
        );

        let transfer_instruction = Transfer {
            from: ctx.accounts.donor_token_account.to_account_info(),
            to: ctx.accounts.campaign_token_account.to_account_info(),
            authority: ctx.accounts.donor.to_account_info(),
        };

        token::transfer(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                transfer_instruction,
            ),
            amount,
        )?;

        campaign.total_funded += amount;

        // Record the donation
        let donation = &mut ctx.accounts.donation;
        donation.donor = ctx.accounts.donor.key();
        donation.campaign = campaign.key();
        donation.amount = amount;
        donation.refunded = false;
        donation.bump = ctx.bumps.donation;

        Ok(())
    }

    pub fn finalize_campaign(ctx: Context<FinalizeCampaign>) -> Result<()> {
        let campaign = &mut ctx.accounts.campaign;
        require!(
            Clock::get()?.unix_timestamp >= campaign.end_time,
            ErrorCode::CampaignNotEnded
        );

        campaign.is_active = false;

        if campaign.total_funded >= campaign.goal_amount {
            // Transfer funds to creator
            let transfer_instruction = Transfer {
                from: ctx.accounts.campaign_token_account.to_account_info(),
                to: ctx.accounts.creator_token_account.to_account_info(),
                authority: ctx.accounts.campaign_authority.to_account_info(),
            };

            token::transfer(
                CpiContext::new_with_signer(
                    ctx.accounts.token_program.to_account_info(),
                    transfer_instruction,
                    &[&[
                        b"campaign",
                        campaign.id.to_le_bytes().as_ref(),
                        &[ctx.bumps.campaign_authority],
                    ]],
                ),
                campaign.total_funded,
            )?;
        }

        Ok(())
    }

    pub fn refund(ctx: Context<Refund>) -> Result<()> {
        let campaign = &ctx.accounts.campaign;
        let donation = &ctx.accounts.donation;

        require!(!campaign.is_active, ErrorCode::CampaignStillActive);
        require!(
            campaign.total_funded < campaign.goal_amount,
            ErrorCode::CampaignSuccessful
        );
        require!(
            donation.donor == ctx.accounts.donor.key(),
            ErrorCode::InvalidDonor
        );
        require!(!donation.refunded, ErrorCode::AlreadyRefunded);

        // Transfer funds back to donor
        let transfer_instruction = Transfer {
            from: ctx.accounts.campaign_token_account.to_account_info(),
            to: ctx.accounts.donor_token_account.to_account_info(),
            authority: ctx.accounts.campaign_authority.to_account_info(),
        };

        token::transfer(
            CpiContext::new_with_signer(
                ctx.accounts.token_program.to_account_info(),
                transfer_instruction,
                &[&[
                    b"campaign",
                    campaign.id.to_le_bytes().as_ref(),
                    &[ctx.bumps.campaign_authority],
                ]],
            ),
            donation.amount,
        )?;

        // Mark the donation as refunded
        let donation_mut = &mut ctx.accounts.donation;
        donation_mut.refunded = true;

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(campaign_id: u64)]
pub struct InitializeCampaign<'info> {
    #[account(
        init,
        payer = creator,
        space = Campaign::LEN,
        seeds = [b"campaign", campaign_id.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub creator: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct Donate<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(mut)]
    pub donor: Signer<'info>,
    #[account(mut)]
    pub donor_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub campaign_token_account: Account<'info, TokenAccount>,
    #[account(
        init,
        payer = donor,
        space = Donation::LEN,
        seeds = [b"donation", campaign.key().as_ref(), donor.key().as_ref()],
        bump
    )]
    pub donation: Account<'info, Donation>,
    pub token_program: Program<'info, Token>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct FinalizeCampaign<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(
        seeds = [b"campaign", campaign.id.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign_authority: AccountInfo<'info>,
    #[account(mut)]
    pub campaign_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub creator_token_account: Account<'info, TokenAccount>,
    pub token_program: Program<'info, Token>,
}

#[derive(Accounts)]
pub struct Refund<'info> {
    #[account(mut)]
    pub campaign: Account<'info, Campaign>,
    #[account(
        seeds = [b"campaign", campaign.id.to_le_bytes().as_ref()],
        bump
    )]
    pub campaign_authority: AccountInfo<'info>,
    #[account(mut)]
    pub campaign_token_account: Account<'info, TokenAccount>,
    #[account(mut)]
    pub donor: Signer<'info>,
    #[account(mut)]
    pub donor_token_account: Account<'info, TokenAccount>,
    #[account(
        mut,
        seeds = [b"donation", campaign.key().as_ref(), donor.key().as_ref()],
        bump
    )]
    pub donation: Account<'info, Donation>,
    pub token_program: Program<'info, Token>,
}

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

#[error_code]
pub enum ErrorCode {
    #[msg("The campaign is not active")]
    CampaignInactive,
    #[msg("The campaign has ended")]
    CampaignEnded,
    #[msg("The campaign has not ended yet")]
    CampaignNotEnded,
    #[msg("The campaign is still active")]
    CampaignStillActive,
    #[msg("The campaign was successful, no refunds allowed")]
    CampaignSuccessful,
    #[msg("Invalid donor for this donation")]
    InvalidDonor,
    #[msg("This donation has already been refunded")]
    AlreadyRefunded,
}
