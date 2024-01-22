/* eslint-disable react-hooks/exhaustive-deps */

import { MouseEventHandler, useEffect, useMemo, useState } from "react";

import {
  ArrowPathIcon,
  ArrowDownTrayIcon,
  WalletIcon,
} from "@heroicons/react/24/outline";
import { useChain } from "@cosmos-kit/react";
import { WalletStatus } from "@cosmos-kit/core";

const buttons = {
  Disconnected: {
    icon: WalletIcon,
    title: "Connect Wallet",
  },
  Connected: {
    icon: WalletIcon,
    title: "My Wallet",
  },
  Rejected: {
    icon: ArrowPathIcon,
    title: "Reconnect",
  },
  Error: {
    icon: ArrowPathIcon,
    title: "Change Wallet",
  },
  NotExist: {
    icon: ArrowDownTrayIcon,
    title: "Install Wallet",
  },
};

interface WalletComponentProps {
  chainName: string;
}

export const WalletSection: React.FC<WalletComponentProps> = ({
  chainName,
}) => {
  const { connect, openView, status } = useChain(chainName);
  const [initiatedConnection, setInitiatedConnection] = useState(false);

  const onClickConnect: MouseEventHandler = async (e) => {
    e.preventDefault();
    setInitiatedConnection(true);
    await connect();
  };

  useEffect(() => {
    if (status === WalletStatus.Disconnected && initiatedConnection) {
      connect();
    }
  }, [chainName, initiatedConnection]);

  const buttonLabel = useMemo(() => {
    switch (status) {
      case WalletStatus.Connected:
        return "Wallet";
      case WalletStatus.Connecting:
        return "Connecting...";
      case WalletStatus.Error:
        return initiatedConnection ? "Reconnect" : "Connect Wallet";
      default:
        return "Connect Wallet";
    }
  }, [status, initiatedConnection]);

  const buttonIcon = useMemo(() => {
    switch (status) {
      case WalletStatus.Connected:
        return <WalletIcon className="flex-shrink-0 w-5 h-5 mr-2" />;
      case WalletStatus.Error:
        return <ArrowPathIcon className="flex-shrink-0 w-5 h-5 mr-2" />;
      default:
        return <WalletIcon className="flex-shrink-0 w-5 h-5 mr-2" />;
    }
  }, [status]);

  let onClick = status === WalletStatus.Connected ? openView : onClickConnect;

  return (
    <button
      className="rounded-lg bg-accent-light z-1   hover:bg-accent-lightHover  min-w-[140px] max-w-[280px] w-auto px-6  dark:hover:bg-gray-bglighthover inline-flex justify-center items-center py-2.5 font-medium text-white  truncate"
      onClick={onClick}
    >
      {buttonIcon}
      <span className="truncate">{buttonLabel}</span>
    </button>
  );
};
