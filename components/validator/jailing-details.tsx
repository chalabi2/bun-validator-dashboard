import { StdFee } from "@cosmjs/stargate";
import { cosmos } from "interchain-query";
import { useState } from "react";
import { useTx } from "../../hooks/useTx";

interface jailingDetails {
  fee: StdFee;
  chainName: string;
  address: string;
  valoperAddress: string;
  isSlashingLoading: boolean;
  isSlashingError: boolean;
}

const JailingDetails: React.FC<jailingDetails> = ({
  chainName,
  address,
  valoperAddress,
  fee,
}) => {
  const [isSigingUnjail, setIsSigningUnjail] = useState<boolean>(false);

  const { tx } = useTx(chainName);

  const { unjail } = cosmos.slashing.v1beta1.MessageComposer.withTypeUrl;

  const msgUnjail = unjail({
    validatorAddr: valoperAddress,
  });

  const handleUnjail = async (event: React.MouseEvent) => {
    event.preventDefault();
    setIsSigningUnjail(true);
    try {
      const result = await tx([msgUnjail], {
        fee,
        onSuccess: () => {},
      });
    } catch (error) {
      setIsSigningUnjail(false);
      console.error("Transaction failed", error);
    } finally {
      setIsSigningUnjail(false);
    }
  };

  return (
    <div className="p-8 rounded-lg bg-white shadow-xl mx-auto max-w-xs">
      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={handleUnjail}
          disabled={isSigingUnjail || !address || !valoperAddress}
          className="relative rounded-md bg-white px-3.5 py-2.5 max-w-[200px] min-w-[200px] text-sm font-semibold text-gray-900 shadow-lg ring-1 ring-inset ring-accent-light focus:border-accent-light hover:bg-gray-50 flex justify-center items-center"
        >
          <span className={`${isSigingUnjail ? "invisible" : "visible"}`}>
            Unjail
          </span>
          {isSigingUnjail && (
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

export default JailingDetails;
