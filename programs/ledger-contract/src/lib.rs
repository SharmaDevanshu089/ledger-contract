use anchor_lang::prelude::*;

// This is your program's public key
declare_id!("JCkLkDfCXtiqwPUrSxDRBN5UC2id9aQHwiMsMCuzru5S");

#[program]
pub mod expense {
    use super::*;
    
    // Rust functions should be snake_case
    pub fn push_expense(ctx: Context<PushExpense>, name: String, cost: i32) -> Result<()> {
        let expense_data = &mut ctx.accounts.expense_data;
        expense_data.expense_name = name;
        expense_data.cost = cost;
        
        msg!("Pushed {} at {} into Blockchain", expense_data.expense_name, expense_data.cost);
        Ok(())
    }
}

#[derive(Accounts)]
// Structs should be UpperCamelCase
pub struct PushExpense<'info> {
    // We must specify the space. 
    // 8 bytes (discriminator) + 4 bytes (string prefix) + 50 bytes (string buffer) + 4 bytes (i32)
    // using 256 is also fine for safety.
    #[account(init, payer = signer, space = 8 + 256)]
    pub expense_data: Account<'info, ExpenseData>,
    
    #[account(mut)]
    pub signer: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[account]
pub struct ExpenseData {
    pub expense_name: String,
    pub cost: i32,
}