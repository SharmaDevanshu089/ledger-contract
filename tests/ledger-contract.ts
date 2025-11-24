import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { Expense } from "../target/types/expense"; 
import * as assert from "assert";

describe("expense", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Expense as Program<Expense>;
  const expenseAccount = anchor.web3.Keypair.generate();

  it("Pushes an expense successfully!", async () => {
    // --- Test Input Data ---
    const expenseName = "Office Supplies";
    const costValue = 450;

    // 1. Send the Transaction
    // Note: 'push_expense' in Rust becomes 'pushExpense' in JS
    await program.methods
      .pushExpense(expenseName, costValue)
      .accounts({
        expenseData: expenseAccount.publicKey,
        signer: provider.wallet.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .signers([expenseAccount])
      .rpc();

    // 2. Fetch the Account Data
    const account = await program.account.expenseData.fetch(
      expenseAccount.publicKey
    );

    // 3. Assertions
    assert.equal(account.expenseName, expenseName);
    assert.equal(account.cost, costValue);

    console.log("--- Expense Creation Successful ---");
    console.log(`Stored Name: ${account.expenseName}`);
    console.log(`Stored Cost: ${account.cost}`);
  });
});