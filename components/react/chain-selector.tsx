import React, { useState } from "react";
import { Chain } from "@chain-registry/types";
import { useChainName } from "../../contexts/chainName";
import { ChevronDownIcon } from "@heroicons/react/20/solid";

interface ChainSelectorProps {
  chains: Chain[];
}

const ChainSelector: React.FC<ChainSelectorProps> = ({ chains }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedChain, setSelectedChain] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { setChainName } = useChainName();

  const handleChainSelect = (chainName: string) => {
    setSelectedChain(chainName);
    setChainName(chainName);
    setIsOpen(false);
    setSearchTerm("");
  };

  const filteredChains = chains.filter(
    (chain) =>
      chain.chain_name &&
      chain.pretty_name &&
      chain.pretty_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedChainDetails = chains.find(
    (chain) => chain.chain_name === selectedChain
  );

  const fixedWidth = "w-[240px]";
  const maxFixedWidth = "max-w-[240px]";

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className={`rounded-lg bg-gray-bg dark:bg-gray-lightbg ${fixedWidth} ${maxFixedWidth} w-auto px-6 hover:bg-gray-bgdarkhover dark:hover:bg-gray-bglighthover inline-flex justify-center items-center py-2.5 font-medium text-white dark:text-black truncate`}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedChain && selectedChainDetails?.logo_URIs?.png && (
          <img
            src={selectedChainDetails.logo_URIs.png}
            alt=""
            className="flex-shrink-0 w-5 h-5 mr-2"
          />
        )}
        <span className="truncate">
          {selectedChain ? selectedChainDetails?.pretty_name : "Select Chain"}
        </span>
        <ChevronDownIcon className="ml-2 w-5 h-5" />
      </button>

      {isOpen && (
        <div
          className={`absolute right-0 ${fixedWidth} ${maxFixedWidth} mt-2 origin-top-right text-white dark:text-black bg-gray-bg dark:bg-gray-lightbg divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none overflow-y-auto max-h-60 z-10`}
        >
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 text-white dark:text-black placeholder-gray-500 focus:outline-none border-none"
            placeholder="Search Chain"
          />
          <div className="py-1">
            {filteredChains.map((chain) => (
              <a
                key={chain.chain_name}
                className="flex items-center px-4 py-2 text-sm text-white dark:text-black hover:bg-gray-100 hover:text-gray-900"
                onClick={() => handleChainSelect(chain.chain_name)}
              >
                {chain.logo_URIs?.png && (
                  <img
                    src={chain.logo_URIs.png}
                    alt=""
                    className="w-8 h-8 mr-2"
                  />
                )}
                {chain.pretty_name}
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChainSelector;
