import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
// Import the generated program types (assuming default Anchor project structure)
import { Expense } from "../target/types/expense"; 
import * as assert from "assert";

// Define the test suite for the 'expense' program
describe("expense", () => {
  // COMPATIBILITY FIX: 
  // Use anchor.Provider.env() for older Anchor versions (<0.26.0)
  const provider = anchor.Provider.env();
  anchor.setProvider(provider);

  // Load the program from the workspace, linking it to the IDL and Program ID
  const program = anchor.workspace.Expense as Program<Expense>;

  // Generate a keypair for the new expense account. 
  const expenseAccount = anchor.web3.Keypair.generate();

  it("Pushes an expense successfully and verifies the data!", async () => {
    // --- Test Input Data ---
    const expenseName = "Office Supplies";
    const costValue = 450; // Corresponds to i32 in Rust

    // 1. Send the Transaction
    // COMPATIBILITY FIX: Use program.rpc for older Anchor versions
    // The signature is: method(arg1, arg2, ..., { accounts: {}, signers: [] })
    await program.rpc.pushExpense(expenseName, costValue, {
        accounts: {
            expenseData: expenseAccount.publicKey,
            signer: provider.wallet.publicKey,
            systemProgram: anchor.web3.SystemProgram.programId,
        },
        signers: [expenseAccount]
    });

    // 2. Fetch the Account Data
    const account = await program.account.expenseData.fetch(
      expenseAccount.publicKey
    );

    // 3. Assertions (Verification)
    assert.equal(account.expenseName, expenseName, "The expense name stored does not match the input.");
    assert.equal(account.cost, costValue, "The cost value stored does not match the input.");

    // Console output for confirmation
    console.log("--- Expense Creation Successful ---");
    console.log(`Account Address: ${expenseAccount.publicKey.toBase58()}`);
    console.log(`Stored Name: ${account.expenseName}`);
    console.log(`Stored Cost: ${account.cost}`);
  });
});