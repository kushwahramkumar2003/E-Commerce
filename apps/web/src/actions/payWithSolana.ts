"use server";
import {
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";

const connection = new Connection("https://api.devnet.solana.com");

interface SAPayload {
  status: string;
  message: string;
  data?: any;
}

export async function payWithSolana(data: {
  recipient: string;
  amount: number;
  payer: string; // Pass the payer's public key from the client side
}): Promise<SAPayload> {
  try {
    console.log("data", data);
    const { recipient, amount } = data;
    const recipientPublicKey = new PublicKey(recipient);
    const payerPublicKey = new PublicKey(
      "FxfMxvBecat982M1DpeCwqWRRc4gk35UZH5bhaFqVoDX"
    );
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: recipientPublicKey,
        toPubkey: recipientPublicKey,
        lamports: amount * 1000000000, // 1 SOL = 1 billion lamports
      })
    );

    console.log("transaction", transaction);

    // Fetch the latest blockhash instead of the deprecated recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = payerPublicKey;

    // Serialize the transaction for client-side signing
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false,
    });

    return {
      status: "success",
      message: "Transaction created successfully",
      data: {
        // transaction: serializedTransaction.toString("base64"),
        transaction: serializedTransaction.toString("base64"),
      },
    };
  } catch (error) {
    return {
      status: "error",
      message: "Failed to create transaction",
      data: {
        //@ts-ignore
        error: error.message,
      },
    };
  }
}
