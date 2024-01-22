import { isDeliverTxSuccess, StdFee } from "@cosmjs/stargate";
import { useChain } from "@cosmos-kit/react";
import { cosmos } from "interchain-query";
import { TxRaw } from "interchain-query/cosmos/tx/v1beta1/tx";

import { useToaster, ToastType, type CustomToast } from "./useToaster";
import { toast as showToast } from "react-toastify";

declare type ToastId = string | number;

interface Msg {
  typeUrl: string;
  value: any;
}

export interface TxOptions {
  fee?: StdFee | null;
  memo?: string;
  toast?: Partial<CustomToast>;
  onSuccess?: () => void;
}

export enum TxStatus {
  Failed = "Transaction Failed",
  Successful = "Transaction Successful",
  Broadcasting = "Transaction Broadcasting",
}

const txRaw = cosmos.tx.v1beta1.TxRaw;

export const useTx = (chainName: string) => {
  const { address, getSigningStargateClient, estimateFee } =
    useChain(chainName);

  const toaster = useToaster();

  const tx = async (msgs: Msg[], options: TxOptions) => {
    if (!address) {
      toaster.toast({
        type: ToastType.Error,
        title: "Wallet not connected",
        message: "Please connect your wallet",
      });
      return;
    }

    let signed: TxRaw;
    let client: Awaited<ReturnType<typeof getSigningStargateClient>>;

    try {
      let fee: StdFee;
      if (options?.fee) {
        fee = options.fee;
        client = await getSigningStargateClient();
      } else {
        const [_fee, _client] = await Promise.all([
          estimateFee(msgs),
          getSigningStargateClient(),
        ]);
        fee = _fee;
        client = _client;
      }
      signed = await client.sign(address, msgs, fee, options.memo || "");
    } catch (e: any) {
      console.error(e);
      toaster.toast({
        title: TxStatus.Failed,
        message: e?.message || "An unexpected error has occured",
        type: ToastType.Error,
      });
      return;
    }

    const loadingToastId = toaster.toast({
      title: TxStatus.Broadcasting,
      message: "Waiting for transaction to be included in a block",
      type: ToastType.Loading,
    });

    if (client && signed) {
      await client
        .broadcastTx(Uint8Array.from(txRaw.encode(signed).finish()))
        .then((res) => {
          //@ts-ignore
          if (isDeliverTxSuccess(res)) {
            if (options.onSuccess) options.onSuccess();

            toaster.toast({
              title: options.toast?.title || TxStatus.Successful,
              type: options.toast?.type || ToastType.Success,
              message: options.toast?.message,
              chainName: chainName,
              txHash: res?.transactionHash,
            });
          } else {
            toaster.toast({
              title: TxStatus.Failed,
              message: res?.rawLog,
              type: ToastType.Error,
              duration: 10000,
            });
          }
        })
        .catch((err) => {
          toaster.toast({
            title: TxStatus.Failed,
            message: err?.message,
            type: ToastType.Error,
            duration: 10000,
          });
        })
        .finally(() => showToast.dismiss(loadingToastId));
    } else {
      showToast.dismiss(loadingToastId);
    }
  };

  return { tx };
};
