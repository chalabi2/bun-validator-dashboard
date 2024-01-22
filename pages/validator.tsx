import Head from "next/head";
import { useState, useEffect, SetStateAction } from "react";
import { useChainName } from "../contexts/chainName";
import { cosmos } from "interchain-query";

import { useTx } from "../hooks/useTx";
import { assets, chains } from "chain-registry";
import { shiftDigits } from "../utils/maths";
import { StdFee } from "@cosmjs/stargate";
import { useChain } from "@cosmos-kit/react";
import { EditDetails } from "../components/validator/edit-details";
import { useValidatorsQuery } from "../query/useQueries";
import { fromBech32, toBech32 } from "@cosmjs/encoding";

interface ValidatorDetails {
  commissionRate: string;
  moniker: string;
  securityContact: string;
  details: string;
  identity: string;
  website: string;
}

export default function Validator() {
  const [isSigingCommission, setIsSigningCommission] = useState<boolean>(false);
  const [isSigingUnjail, setIsSigningUnjail] = useState<boolean>(false);
  const [isSigingDetails, setIsSigningDetails] = useState<boolean>(false);

  const commissionStats = [
    { name: "Commission", stat: "71,897 $AKT" },
    { name: "Commission Monthly Avg", stat: "2,000 $AKT" },
    { name: "Validator", stat: "Chandra Station" },
  ];

  const slashingStats = [
    { name: "Missed Blocks", stat: "1,000" },
    { name: "Validator", stat: "Chandra Station" },
    { name: "Jail Status", stat: "True" },
  ];

  const { chainName } = useChainName();

  const { address } = useChain(chainName);

  function getValoperAddress(
    address: string | undefined,
    chainName: string | undefined
  ): string | undefined {
    if (!address) {
      return undefined;
    }
    const { data } = fromBech32(address);

    const chainInfo = chains.find(({ chain_name }) => chain_name === chainName);

    if (!chainInfo) {
      console.warn("Chain not found");
      return undefined;
    }

    const bech32Prefix = chainInfo.bech32_prefix;
    const valoperPrefix = bech32Prefix + "valoper";
    return toBech32(valoperPrefix, data);
  }

  const [valoperAddress, setValoperAddress] = useState("");

  useEffect(() => {
    const updateValoperAddress = () => {
      const newAddress = getValoperAddress(address, chainName);
      setValoperAddress(newAddress || "");
    };

    updateValoperAddress();
  }, [chainName, address]);

  const { validatorsData, isError, isLoading } = useValidatorsQuery(chainName);

  const [validatorDetails, setValidatorDetails] = useState<ValidatorDetails>({
    commissionRate: "",
    moniker: "",
    securityContact: "",
    details: "",
    identity: "",
    website: "",
  });

  useEffect(() => {
    if (validatorsData && valoperAddress) {
      const foundValidator = validatorsData.find(
        (validator) => validator.address === valoperAddress
      );
      if (foundValidator) {
        setValidatorDetails({
          commissionRate: foundValidator.commission,
          moniker: foundValidator.name,
          securityContact: foundValidator.securityContact,
          details: foundValidator.description,
          identity: foundValidator.identity,
          website: foundValidator.website,
        });
      }
    }
  }, [validatorsData, valoperAddress, chainName]);

  const { tx } = useTx(chainName);

  const { withdrawValidatorCommission, withdrawDelegatorReward } =
    cosmos.distribution.v1beta1.MessageComposer.withTypeUrl;

  const { unjail } = cosmos.slashing.v1beta1.MessageComposer.withTypeUrl;

  const msgClaimCommission = withdrawValidatorCommission({
    validatorAddress: "",
  });

  const msgClaimRewards = withdrawDelegatorReward({
    validatorAddress: "cosmosvaloper196ax4vc0lwpxndu9dyhvca7jhxp70rmcvrj90c",
    delegatorAddress: address ?? "",
  });

  const msgUnjail = unjail({
    validatorAddr: "",
  });

  const mainTokens = assets.find(({ chain_name }) => chain_name === chainName);
  const fees = chains.find(({ chain_name }) => chain_name === chainName)?.fees
    ?.fee_tokens;
  const mainDenom = mainTokens?.assets[0].base ?? "";
  let feeAmount;
  if (chainName === "sommelier") {
    feeAmount = "10000";
  } else {
    const fixedMinGasPrice =
      fees?.find(({ denom }) => denom === mainDenom)?.average_gas_price ?? "";
    feeAmount = shiftDigits(fixedMinGasPrice, 6).toString();
  }

  const fee: StdFee = {
    amount: [
      {
        denom: mainDenom,
        amount: feeAmount,
      },
    ],
    gas: "500000",
  };

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
    <div className="relative z-0 max-w-screen px-10 mx-6 lg:mx-auto">
      <Head>
        <title>Block Explorer</title>
        <meta name="description" content="Generated by create cosmos app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <EditDetails
        validatorDetails={validatorDetails}
        address={address ?? ""}
        fee={fee}
        chainName={chainName}
        valoperAddress={valoperAddress}
      />
    </div>
  );
}
