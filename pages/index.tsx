import Head from "next/head";
import { WalletSection } from "../components";
import { chains } from "chain-registry";

import { useTheme } from "../contexts/theme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";
import { useValidatorsQuery } from "../query/useQueries";
import { useChainName } from "../contexts/chainName";
import ChainSelector from "../components/react/chain-selector";

export default function Home() {
  return (
    <div className="max-w-screen py-10 px-10 mx-6 lg:mx-auto">
      <Head>
        <title>Validator Dashboard</title>
        <meta
          name="description"
          content="A dashboard to assist validator operations"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
    </div>
  );
}
