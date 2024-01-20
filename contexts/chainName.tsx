import React, { createContext, useContext, useState, ReactNode } from "react";

interface ChainNameContextType {
  chainName: string;
  setChainName: (chainName: string) => void;
}

const ChainNameContext = createContext<ChainNameContextType | undefined>(
  undefined
);

export const ChainNameProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [chainName, setChainName] = useState<string>("cosmoshub");

  return (
    <ChainNameContext.Provider value={{ chainName, setChainName }}>
      {children}
    </ChainNameContext.Provider>
  );
};

export const useChainName = (): ChainNameContextType => {
  const context = useContext(ChainNameContext);
  if (context === undefined) {
    throw new Error("useChainName must be used within a ChainNameProvider");
  }
  return context;
};
