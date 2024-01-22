import { StdFee } from "@cosmjs/stargate";
import { cosmos } from "interchain-query";
import { useState } from "react";
import { useTx } from "../../hooks/useTx";
import { camelCaseToWords } from "../../utils/maths";

interface editDetails {
  validatorDetails: {
    moniker: string;
    commissionRate: string;
    identity: string;
    details: string;
    securityContact: string;
    website: string;
  };
  fee: StdFee;
  chainName: string;
  address: string;
  valoperAddress: string;
}

export const EditDetails: React.FC<editDetails> = ({
  validatorDetails,
  fee,
  chainName,
  address,
  valoperAddress,
}) => {
  const [editDetailsState, setEditDetailsState] = useState(validatorDetails);

  const [isSigingDetails, setIsSigningDetails] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "commissionRate") {
      if (value === "") {
        setEditDetailsState((prevState) => ({
          ...prevState,
          [name]: value,
        }));
      } else if (!isNaN(Number(value))) {
        const numberValue = Math.max(1, Math.min(Number(value), 100));
        setEditDetailsState((prevState) => ({
          ...prevState,
          [name]: numberValue.toString(),
        }));
      }
    } else {
      setEditDetailsState((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const { tx } = useTx(chainName);

  const { editValidator } = cosmos.staking.v1beta1.MessageComposer.withTypeUrl;

  const handleUpdateDetails = async (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
    setIsSigningDetails(true);

    const formattedCommissionRate = editDetailsState.commissionRate
      ? (Number(editDetailsState.commissionRate) / 100).toFixed(2)
      : "";

    const msgEditValidator = editValidator({
      validatorAddress: valoperAddress,
      description: {
        moniker: editDetailsState.moniker || validatorDetails.moniker,
        identity: editDetailsState.identity || validatorDetails.identity,
        website: editDetailsState.website || validatorDetails.website,
        security_contact:
          editDetailsState.securityContact || validatorDetails.securityContact,
        details: editDetailsState.details || validatorDetails.details,
      },
      // Only include commissionRate and minSelfDelegation if they are updated
      commissionRate: formattedCommissionRate || "",
      minSelfDelegation: "",
    });

    try {
      await tx([msgEditValidator], {
        fee,
        onSuccess: () => {
          /* handle success */
        },
      });
    } catch (error) {
      console.error("Transaction failed", error);
    } finally {
      setIsSigningDetails(false);
    }
  };

  type EditDetailsStateKeys = keyof typeof editDetailsState;

  return (
    <div className="p-8 rounded-lg bg-white shadow-xl mx-auto max-w-xs">
      {Object.entries(validatorDetails).map(([key, placeholder], index) => {
        const detailKey = key as EditDetailsStateKeys;
        return (
          <div key={index} className="my-4">
            <label
              htmlFor={detailKey}
              className="block text-sm font-medium leading-6 text-slate-600"
            >
              {camelCaseToWords(detailKey)}
            </label>
            <div className="mt-2">
              <input
                type="text"
                name={detailKey}
                id={detailKey}
                value={editDetailsState[detailKey]}
                onChange={handleInputChange}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                placeholder={placeholder}
              />
            </div>
          </div>
        );
      })}
      <div className="flex justify-center mt-8">
        <button
          type="button"
          onClick={handleUpdateDetails}
          disabled={isSigingDetails || !address || !valoperAddress}
          className="relative rounded-md bg-white px-3.5 py-2.5 max-w-[200px] min-w-[200px] text-sm font-semibold text-gray-900 shadow-lg ring-1 ring-inset ring-accent-light focus:border-accent-light hover:bg-gray-50 flex justify-center items-center"
        >
          <span className={`${isSigingDetails ? "invisible" : "visible"}`}>
            Update Details
          </span>
          {isSigingDetails && (
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
