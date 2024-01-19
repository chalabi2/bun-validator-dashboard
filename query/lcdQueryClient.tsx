import { useState, useEffect } from "react";
import { cosmos } from "@chalabi/quicksilverjs";
import { useQuery } from "@tanstack/react-query";
import { useChain } from "@cosmos-kit/react";

const createLcdQueryClient = cosmos.ClientFactory.createLCDClient;

export const useLcdQueryClient = (chainName: string) => {
  const { getRestEndpoint } = useChain(chainName);
  const [resolvedRestEndpoint, setResolvedRestEndpoint] = useState<
    string | null
  >(null);

  useEffect(() => {
    const resolveEndpoint = async () => {
      const endpoint = await getRestEndpoint();

      if (typeof endpoint === "string") {
        setResolvedRestEndpoint(endpoint);
      } else if (endpoint && typeof endpoint === "object") {
        setResolvedRestEndpoint(endpoint.url);
      }
    };

    resolveEndpoint();
  }, [getRestEndpoint]);

  const lcdQueryClient = useQuery({
    queryKey: ["lcdQueryClient", resolvedRestEndpoint],
    queryFn: () =>
      createLcdQueryClient({
        restEndpoint: resolvedRestEndpoint || "",
      }),
    enabled: !!resolvedRestEndpoint,
    staleTime: Infinity,
  });

  return {
    lcdQueryClient: lcdQueryClient.data,
  };
};
