import { WalletSection } from "../wallet";
import { chains } from "chain-registry";

import { useTheme } from "../../contexts/theme";
import { MoonIcon, SunIcon } from "@heroicons/react/24/outline";

import { useChainName } from "../../contexts/chainName";
import ChainSelector from "./chain-selector";

export default function Header() {
  const { chainName } = useChainName();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className=" border-gray-bg dark:border-gray-lightbg flex justify-between items-center border-b-2 mb-4 py-6 px-10 mx-auto">
      <h1 className="text-4xl font-bold pl-4 text-gray-bg dark:text-gray-lightbg">
        Validator Dashboard
      </h1>
      <div className="flex items-center gap-4">
        <ChainSelector chains={chains} />
        <WalletSection chainName={chainName} />
        <button
          className="inline-flex items-center justify-center w-12 h-11 border rounded-lg hover:bg-gray-bgdarkhover dark:hover:bg-gray-bglighthover bg-gray-bg dark:bg-gray-lightbg border-black/10 dark:border-white/10"
          onClick={toggleTheme}
        >
          {theme === "light" ? (
            <MoonIcon className="text-white w-5 h-5" />
          ) : (
            <SunIcon className="text-black w-6 h-6" />
          )}
        </button>
      </div>
    </header>
  );
}
