import { useLcdQueryClient } from "./lcdQueryClient";
import { cosmos } from "@chalabi/quicksilverjs";
import { useQuery } from "@tanstack/react-query";
import { BigNumber } from "bignumber.js";
import Long from "long";
import { parseValidators } from "../utils/staking";
import { useEffect } from "react";

export const useValidatorCommissionQuery = (
  chainName: string,
  valoperAddress: string
) => {
  const { lcdQueryClient } = useLcdQueryClient(chainName);

  const fetchCommission = async () => {
    if (!lcdQueryClient) {
      throw new Error("RPC Client not ready");
    }
    const commission =
      await lcdQueryClient.cosmos.distribution.v1beta1.validatorCommission({
        validatorAddress: valoperAddress,
      });
    return commission;
  };

  const commissionQuery = useQuery({
    queryKey: ["validators", chainName],
    queryFn: fetchCommission,
    enabled: !!lcdQueryClient && !!valoperAddress,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (lcdQueryClient && valoperAddress) {
      commissionQuery.refetch();
    }
  }, [chainName, lcdQueryClient, commissionQuery, valoperAddress]);

  return {
    commissionData: commissionQuery.data,
    isCommissionLoading: commissionQuery.isLoading,
    isCommissionError: commissionQuery.isError,
  };
};

export const useSlashingQuery = (chainName: string, valconsAddress: string) => {
  const { lcdQueryClient } = useLcdQueryClient(chainName);

  const fetchSigningInfo = async () => {
    if (!lcdQueryClient) {
      throw new Error("RPC Client not ready");
    }
    const slashing = await lcdQueryClient.cosmos.slashing.v1beta1.signingInfo({
      consAddress: valconsAddress,
    });
    return slashing;
  };

  const slashingQuery = useQuery({
    queryKey: ["signingInfo", chainName],
    queryFn: fetchSigningInfo,
    enabled: !!lcdQueryClient && !!valconsAddress,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (lcdQueryClient && valconsAddress) {
      slashingQuery.refetch();
    }
  }, [chainName, lcdQueryClient, slashingQuery, valconsAddress]);

  return {
    slashingData: slashingQuery.data,
    isSlashingLoading: slashingQuery.isLoading,
    isSlashingError: slashingQuery.isError,
  };
};

export const useValidatorsQuery = (chainName: string) => {
  const { lcdQueryClient } = useLcdQueryClient(chainName);

  const fetchValidators = async (nextKey = new Uint8Array()) => {
    if (!lcdQueryClient) {
      throw new Error("RPC Client not ready");
    }

    const validators = await lcdQueryClient.cosmos.staking.v1beta1.validators({
      status: cosmos.staking.v1beta1.bondStatusToJSON(
        cosmos.staking.v1beta1.BondStatus.BOND_STATUS_BONDED
      ),
      pagination: {
        next_key: nextKey,
        offset: Long.fromNumber(0),
        limit: Long.fromNumber(200),
        countTotal: true,
        reverse: false,
      },
    });
    return validators;
  };

  const validatorQuery = useQuery({
    queryKey: ["validators", chainName],

    queryFn: async () => {
      let allValidators: any[] = [];
      let nextKey = new Uint8Array();

      do {
        const response = await fetchValidators(nextKey);
        allValidators = allValidators.concat(response.validators);
        nextKey = response.pagination?.next_key ?? new Uint8Array();
      } while (nextKey && nextKey.length > 0);
      const sorted = allValidators.sort((a, b) =>
        new BigNumber(b.tokens).minus(a.tokens).toNumber()
      );
      return parseValidators(sorted);
    },

    enabled: !!lcdQueryClient,
    staleTime: Infinity,
  });

  useEffect(() => {
    if (lcdQueryClient) {
      validatorQuery.refetch();
    }
  }, [chainName, lcdQueryClient, validatorQuery]);

  return {
    validatorsData: validatorQuery.data,
    isLoading: validatorQuery.isLoading,
    isError: validatorQuery.isError,
  };
};
