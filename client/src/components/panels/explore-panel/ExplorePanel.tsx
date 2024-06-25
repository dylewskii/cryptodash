// components
import CryptoListTable from "./CryptoListTable";
// react
import { useEffect, useMemo, useState } from "react";
// interface
import { CoinObject } from "./CryptoListTable";
// misc
import { Input } from "@/components/ui/input";

export default function ExplorePanel() {
  const [cryptoList, setCryptoList] = useState<CoinObject[]>([]);
  const [searchActive, setSearchActive] = useState<boolean>(false);
  const [query, setQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const filteredCryptoCoins = useMemo(() => {
    return cryptoList.filter((coin) =>
      coin.name.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, cryptoList]);

  useEffect(() => {
    const fetchCryptoCoinsList = async () => {
      setLoading(true);
      const url = `http://localhost:8000/data/all-coins-with-market-data`;
      try {
        const response = await fetch(url, {
          credentials: "include",
        });
        const data = await response.json();
        setLoading(false);
        setCryptoList(data.data);
      } catch (err) {
        console.error("Failed to fetch coins list from API:", err);
      }
    };
    fetchCryptoCoinsList();
  }, []);

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
          onChange={(e) => {
            setQuery(e.target.value);
            setSearchActive(e.target.value.trim().length > 0);
          }}
        />
      </div>

      <CryptoListTable
        cryptoList={searchActive ? filteredCryptoCoins : cryptoList}
        loading={loading}
      />
    </section>
  );
}
