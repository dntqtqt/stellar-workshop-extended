import { useState } from "react";
import { TransactionBuilder, rpc } from "@stellar/stellar-sdk";
import { signTransaction } from "~/config/wallet.client";
import type { AssembledTransaction } from "@stellar/stellar-sdk/contract";

interface UseSubmitTransactionOptions {
  rpcUrl: string;
  networkPassphrase: string;
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useSubmitTransaction(options: UseSubmitTransactionOptions) {
  const [isSubmitting, setSubmitting] = useState(false);

  async function submit(tx: AssembledTransaction<any>) {
    setSubmitting(true);
    try {
      const builtTxXDR = tx.toXDR();
      const signedXDR = await signTransaction(builtTxXDR);

      // Submit transaction to the network
      const server = new rpc.Server(options.rpcUrl);
      const sentTx = await server.sendTransaction(
        TransactionBuilder.fromXDR(signedXDR.signedTxXdr, options.networkPassphrase)
      );

      // Wait for transaction confirmation with polling
      if (sentTx.status === "PENDING") {
        const txHash = sentTx.hash;
        let attempts = 0;
        const maxAttempts = 10;

        while (attempts < maxAttempts) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          console.log("masuk while");
          try {
            console.log("masuk try");
            const txStatus = await server.getTransaction(txHash);
            console.log({ txStatus });
            if (txStatus.status === "SUCCESS") {
              options.onSuccess?.();
              return { success: true };
            } else if (txStatus.status === "FAILED") {
              throw new Error("Transaction failed");
            }
          } catch (e) {
            // Continue polling
          }
          attempts++;
        }

        throw new Error("Transaction timeout");
      }

      // If not pending, transaction was accepted
      options.onSuccess?.();
      return { success: true };
    } catch (e) {
      console.error("Transaction submission failed", e);
      options.onError?.(e);
      return { success: false, error: e };
    } finally {
      setSubmitting(false);
    }
  }

  return { submit, isSubmitting };
}
