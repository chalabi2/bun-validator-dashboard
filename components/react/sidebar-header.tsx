import { Fragment, ReactNode, useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  ScaleIcon,
  XCircleIcon,
  HomeIcon,
  MoonIcon,
  SunIcon,
  XMarkIcon,
  SquaresPlusIcon,
  BanknotesIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { chains } from "chain-registry";

import { WalletSection } from "../wallet";
import ChainSelector from "./chain-selector";
import { useChainName } from "../../contexts/chainName";
import { useTheme } from "../../contexts/theme";
import router, { useRouter } from "next/router";

const isClient = typeof window === "object";

const userNavigation = [
  { name: "Your profile", href: "#" },
  { name: "Sign out", href: "#" },
];

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}

interface LayoutProps {
  children: ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { chainName } = useChainName();
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [currentPath, setCurrentPath] = useState(router.pathname);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      setCurrentPath(url);
    };

    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router]);

  const navigation = [
    {
      name: "Home",
      href: "/",
      icon: HomeIcon,
      current: currentPath === "/",
    },
    {
      name: "Validator",
      href: "/validator",
      icon: UserIcon,
      current: currentPath === "/validator",
    },

    { name: "Governance", href: "governance", icon: ScaleIcon, current: false },
    { name: "Monitor", href: "monitor", icon: SquaresPlusIcon, current: false },
  ];

  return (
    <>
      <div>
        <Transition.Root show={sidebarOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-1 lg:hidden"
            onClose={setSidebarOpen}
          >
            <Transition.Child
              as={Fragment}
              enter="transition-opacity ease-linear duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity ease-linear duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900/80" />
            </Transition.Child>
            <div className="fixed inset-0 flex">
              <Transition.Child
                as={Fragment}
                enter="transition ease-in-out duration-300 transform"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transition ease-in-out duration-300 transform"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-300"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
                      <button
                        type="button"
                        className="-m-2.5 p-2.5"
                        onClick={() => setSidebarOpen(false)}
                      >
                        <span className="sr-only">Close sidebar</span>
                        <XMarkIcon
                          className="h-6 w-6 text-white"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </Transition.Child>
                  <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-gray-bg dark:bg-gray-lightbg px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                      <img
                        className="h-8 w-auto"
                        src="/blocks.svg"
                        alt="Your Company"
                      />
                    </div>
                    <nav className="flex flex-1 flex-col">
                      <ul role="list" className="flex flex-1 flex-col gap-y-7">
                        <li>
                          <ul role="list" className="-mx-2 space-y-1">
                            {navigation.map((item) => (
                              <li key={item.name}>
                                <a
                                  onClick={() => router.push(item.href)}
                                  className={classNames(
                                    item.current
                                      ? "bg-indigo-700 text-white dark:text-black"
                                      : "text-white dark:text-black hover:text-white hover:bg-[#5a5f71]",
                                    "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                                  )}
                                >
                                  <item.icon
                                    className={classNames(
                                      item.current
                                        ? "text-white"
                                        : "text-indigo-200 group-hover:text-white",
                                      "h-6 w-6 shrink-0"
                                    )}
                                    aria-hidden="true"
                                  />
                                  {item.name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        </li>
                        <li className="mt-auto">
                          <a
                            href="#"
                            className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-indigo-200 hover:bg-indigo-700 hover:text-white"
                          >
                            Chandra Station
                          </a>
                        </li>
                      </ul>
                    </nav>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </Dialog>
        </Transition.Root>

        {/* Static sidebar for desktop */}
        <div className="hidden overflow-y-hidden lg:fixed lg:inset-y-0 lg:z-10 bg-gray-50 lg:flex lg:w-56 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r  px-6 pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <img
                className="h-16 w-auto"
                src="/blocks.svg"
                alt="Your Company"
              />
            </div>
            <nav className="flex flex-1 flex-col">
              <ul role="list" className="flex flex-1 flex-col gap-y-7">
                <li>
                  <ul role="list" className="-mx-2 space-y-1">
                    {navigation.map((item) => (
                      <li key={item.name}>
                        <a
                          onClick={() => router.push(item.href)}
                          className={classNames(
                            item.current
                              ? "bg-accent-light dark:bg-accent-dark cursor-default text-white"
                              : "text-gray-700 hover:bg-gray-300 dark:text-gray-200 hover:text-gray-900 cursor-pointer dark:hover:text-gray-100",
                            "group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold"
                          )}
                        >
                          <item.icon
                            className={classNames(
                              item.current
                                ? "text-white"
                                : "text-gray-500 dark:text-gray-400 group-hover:text-gray-600",
                              "h-6 w-6 shrink-0"
                            )}
                            aria-hidden="true"
                          />
                          {item.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </li>
                <li></li>
                <li className="mt-auto">
                  <a
                    href="#"
                    className="group -mx-2 flex gap-x-3 rounded-md p-2 text-sm font-semibold leading-6 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    Chandra Station
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        <div className="relative w-screen lg:pl-56">
          <div className="top-0 z-1 flex h-16 shrink-0 items-center gap-x-4 border-b  bg-gray-100 dark:bg-gray-800 px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
            <button
              type="button"
              className="-m-2.5 p-2.5 text-gray-700 dark:text-gray-300 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
            <h1 className="hidden md:block lg:block truncate text-2xl font-bold text-gray-900 dark:text-gray-100">
              Validator Dashboard
            </h1>

            {/* Separator */}
            <div
              className="h-6 w-px bg-gray-900/10 lg:hidden"
              aria-hidden="true"
            />
            <div className="flex relative items-center z-50 gap-4 ml-auto">
              <ChainSelector chains={chains} />
              <WalletSection chainName={chainName} />
              <button
                className="inline-flex items-center justify-center w-12 h-11  rounded-lg bg-accent-light hover:bg-accent-lightHover "
                onClick={toggleTheme}
              >
                {theme === "light" ? (
                  <MoonIcon className="w-6 h-6 text-white" />
                ) : (
                  <SunIcon className="w-6 h-6 text-white" />
                )}
              </button>
            </div>
          </div>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex items-center gap-x-4 lg:gap-x-6">
              {/* Profile dropdown */}
              <Menu as="div" className="relative">
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-50 mt-2.5 w-32 origin-top-right rounded-md bg-white dark:bg-gray-700 py-2 shadow-lg ring-1 ring-black/10 focus:outline-none">
                    {userNavigation.map((item) => (
                      <Menu.Item key={item.name}>
                        {({ active }) => (
                          <a
                            href={item.href}
                            className={classNames(
                              active ? "bg-gray-100 dark:bg-gray-600" : "",
                              "block px-3 py-1 text-sm leading-6 text-gray-900 dark:text-gray-200"
                            )}
                          >
                            {item.name}
                          </a>
                        )}
                      </Menu.Item>
                    ))}
                  </Menu.Items>
                </Transition>
              </Menu>
            </div>
          </div>
        </div>

        <main className="relative z-0 lg:pl-56 mx-auto bg-gray-50 dark:bg-gray-900 max-h-screen overflow-hidden py-24">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </>
  );
};
