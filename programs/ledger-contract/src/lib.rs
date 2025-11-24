use anchor_lang::prelude::*;

// This is your program's public key and it will update
// automatically when you build the project.
declare_id!("JCkLkDfCXtiqwPUrSxDRBN5UC2id9aQHwiMsMCuzru5S");

#[program]
pub mod expense {
    use super::*;
    pub fn push_Expense(ctx: Context<Push_Expense>, name: String,cost:i32) -> Result<()> {
        ctx.accounts.Expense_Data.expense_name = name.clone();
        ctx.accounts.Expense_Data.cost = cost.clone();
        msg!("Pushed {} at {} into Blockchain",name , cost);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Push_Expense<'info> {
    // We must specify the space in order to initialize an account.
    // First 8 bytes are default account discriminator,
    // next 8 bytes come from NewAccount.data being type u64.
    // (u64 = 64 bits unsigned integer = 8 bytes)
    #[account(init, payer = signer, space = 8 + 256)]
    pub Expense_Data: Account<'info, Expense_Data>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[account]
pub struct Expense_Data {
    expense_name:String,
    cost : i32,
}