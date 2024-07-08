// components
import CryptoListTable from "./CryptoListTable";
// react
import { useCallback, useEffect, useMemo, useState } from "react";
// misc
import { Input } from "@/components/ui/input";
import { useUserStore } from "@/stores/useUserStore";
import { useCoinStore } from "@/stores/useCoinStore";

export default function ExplorePanel() {
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const accessToken = useUserStore((state) => state.accessToken);
  const user = useUserStore((state) => state.user);
  const cryptoList = useCoinStore((state) => state.cryptoList);
  const fetchAllCoins = useCoinStore((state) => state.fetchAllCoins);
  const fetchAllCoinsPending = useCoinStore(
    (state) => state.fetchAllCoinsPending
  );

  // filtered list of coins based on the search query
  const filteredCryptoCoins = useMemo(() => {
    return cryptoList.filter((coin) =>
      coin.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, cryptoList]);

  // on mount - load crypto names from the 1st page
  useEffect(() => {
    if (user.isAuthenticated) {
      fetchAllCoins(1);
    }
  }, [fetchAllCoins, user.isAuthenticated, accessToken]);

  // fetch new coins when the page changes (i.e reaches bottom of the page)
  useEffect(() => {
    fetchAllCoins(page);
  }, [page, fetchAllCoins, accessToken]);

  const handleInfiniteScroll = useCallback(() => {
    const scrollHeight = document.documentElement.scrollHeight; // total document height (including the part not visible on the screen)
    const scrollTop = document.documentElement.scrollTop; // nr of pixels the document is currently scrolled from the top
    const innerHeight = window.innerHeight; // inner height of the window (viewport)

    // if user has scrolled to the bottom of the page, load the next page
    if (innerHeight + scrollTop + 1 >= scrollHeight && !fetchAllCoinsPending) {
      setPage((prev) => prev + 1);
    }
  }, [fetchAllCoinsPending]);

  useEffect(() => {
    window.addEventListener("scroll", handleInfiniteScroll);

    // cleanup
    return () => window.removeEventListener("scroll", handleInfiniteScroll);
  }, [handleInfiniteScroll]);

  return (
    <section className="my-4">
      <div className="flex items-center border-2 border-black rounded py-2">
        <div className="flex justify-center min-w-14">
          <svg
            className="w-5 h-5 mr-1"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M21 21L17.5001 17.5M20 11.5C20 16.1944 16.1944 20 11.5 20C6.80558 20 3 16.1944 3 11.5C3 6.80558 6.80558 3 11.5 3C16.1944 3 20 6.80558 20 11.5Z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <Input
          className="border-none"
          placeholder="Search the cryptocurrency market"
          type="text"
          value={query}
          isFocusVisible={false}
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchActive(e.target.value.trim().length > 0);
          }}
        />
      </div>
      <CryptoListTable
        cryptoList={searchActive ? filteredCryptoCoins : cryptoList}
        loading={fetchAllCoinsPending}
      />
    </section>
  );
}
