import "../styles/globals.css";
import type { AppProps } from "next/app";

import { ChainProvider } from "@cosmos-kit/react";
import { wallets as keplrWallets } from "@cosmos-kit/keplr";
import { wallets as cosmostationWallets } from "@cosmos-kit/cosmostation";
import { wallets as leapWallets } from "@cosmos-kit/leap";

import { TailwindModal } from "../components";
import { ThemeProvider } from "../contexts/theme";

import { SignerOptions } from "@cosmos-kit/core";
import { chains, assets } from "chain-registry";
import "@interchain-ui/react/styles";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

function CreateCosmosApp({ Component, pageProps }: AppProps) {
  // const signerOptions: SignerOptions = {
  //   signingStargate: () => {
  //     return getSigningCosmosClientOptions();
  //   }
  // };

  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: 2,
        refetchOnWindowFocus: false,
      },
    },
  });

  function isWalletClientAvailable(walletName: string) {
    if (typeof window === "undefined") {
      // We're on the server, return false or handle accordingly
      return false;
    }

    switch (walletName) {
      case "Keplr":
        return typeof window.keplr !== "undefined";
      case "Cosmostation":
        return typeof window.cosmostation !== "undefined";
      case "Leap":
        return typeof window.leap !== "undefined";
      default:
        return false;
    }
  }

  const availableWallets = [];

  if (isWalletClientAvailable("Keplr")) {
    availableWallets.push(...keplrWallets);
  }
  if (isWalletClientAvailable("Cosmostation")) {
    availableWallets.push(...cosmostationWallets);
  }
  if (isWalletClientAvailable("Leap")) {
    availableWallets.push(...leapWallets);
  }

  return (
    <ChainProvider
      endpointOptions={{
        isLazy: true,
        endpoints: {
          cosmoshub: {
            rpc: ["https://rpc.cosmoshub-4.quicksilver.zone"],
            rest: ["https://lcd.cosmoshub-4.quicksilver.zone"],
          },
        },
      }}
      chains={chains}
      assetLists={assets}
      wallets={availableWallets}
      walletConnectOptions={{
        signClient: {
          projectId: "a8510432ebb71e6948cfd6cde54b70f7",
          relayUrl: "wss://relay.walletconnect.org",
          metadata: {
            name: "CosmosKit Template",
            description: "CosmosKit dapp template",
            url: "https://docs.cosmoskit.com/",
            icons: [],
          },
        },
      }}
      //@ts-ignore
      walletModal={TailwindModal}
    >
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <ReactQueryDevtools initialIsOpen={true} />
          <div className="min-h-screen text-black bg-gray-lightbg dark:bg-gray-bg dark:text-white">
            <Component {...pageProps} />
          </div>
        </QueryClientProvider>
      </ThemeProvider>
    </ChainProvider>
  );
}

export default CreateCosmosApp;
