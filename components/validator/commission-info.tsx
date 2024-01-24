import { StdFee } from "@cosmjs/stargate";
import { cosmos } from "interchain-query";
import { DecCoinSDKType } from "interchain-query/cosmos/base/v1beta1/coin";
import { useState } from "react";
import { useTx } from "../../hooks/useTx";

interface commissionDetails {
  fee: StdFee;
  chainName: string;
  address: string;
  valoperAddress: string;
  isCommissionLoading: boolean;
  isCommissionError: boolean;
  commissionAvailable: DecCoinSDKType[] | undefined;
}

const CommissionDetails: React.FC<commissionDetails> = ({
  fee,
  chainName,
  isCommissionError,
  isCommissionLoading,
  address,
  valoperAddress,
}) => {
  const [isSigingCommission, setIsSigningCommission] = useState<boolean>(false);

  const { tx } = useTx(chainName ?? "");

  const { withdrawValidatorCommission, withdrawDelegatorReward } =
    cosmos.distribution.v1beta1.MessageComposer.withTypeUrl;

  const msgClaimCommission = withdrawValidatorCommission({
    validatorAddress: valoperAddress,
  });

  const msgClaimRewards = withdrawDelegatorReward({
    validatorAddress: valoperAddress,
    delegatorAddress: address ?? "",
  });

  const handleCommissionClaim = async (event: React.MouseEvent) => {
    event.preventDefault();
    setIsSigningCommission(true);
    try {
      const result = await tx([msgClaimRewards, msgClaimCommission], {
        fee,
        onSuccess: () => {},
      });
    } catch (error) {
      setIsSigningCommission(false);
      console.error("Transaction failed", error);
    } finally {
      setIsSigningCommission(false);
    }
  };

  return (
    <div className="p-8 rounded-lg bg-white shadow-xl mx-auto max-w-xs">
      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={handleCommissionClaim}
          disabled={isSigingCommission || !address || !valoperAddress}
          className="relative rounded-md bg-white px-3.5 py-2.5 max-w-[200px] min-w-[200px] text-sm font-semibold text-gray-900 shadow-lg ring-1 ring-inset ring-accent-light focus:border-accent-light hover:bg-gray-50 flex justify-center items-center"
        >
          <span className={`${isSigingCommission ? "invisible" : "visible"}`}>
            Claim Commission
          </span>
          {isSigingCommission && (
            <div className="absolute inset-0 flex justify-center items-center">
              <div className="animate-spin rounded-full h-6 w-6">
                <div className="w-full h-full rounded-full border-2 border-t-accent-light border-r-accent-light  border-l-accent-light"></div>
              </div>
              <span className="pl-2">Processing...</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default CommissionDetails;
