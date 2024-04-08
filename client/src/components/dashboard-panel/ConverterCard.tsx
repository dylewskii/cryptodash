("use client");
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";
import { Input } from "@/components/ui/input";

const cryptoList = [
  {
    value: "Bitcoin",
    label: "Bitcoin",
  },
  {
    value: "Ethereum",
    label: "Ethereum",
  },
  {
    value: "Solana",
    label: "Solana",
  },
  {
    value: "Dogecoin",
    label: "Dogecoin",
  },
  {
    value: "Avalanche",
    label: "Avalanche",
  },
];

const fiatList = [
  {
    value: "Pound Sterling (GBP)",
    label: "Pound Sterling (GBP)",
  },
  {
    value: "Dollars",
    label: "Dollars (USD)",
  },
  {
    value: "Euro (EUR)",
    label: "Euro (EUR)",
  },
  {
    value: "Swiss Franc (CHF)",
    label: "Swiss Franc (CHF)",
  },
  {
    value: "Yuan (CN)",
    label: "Yuan (CN)",
  },
];

interface ConverterCardProps {
  className?: string; // The question mark denotes that the prop is optional
}

export default function ConverterCard({ className = "" }: ConverterCardProps) {
  const [cryptoOpen, setCryptoOpen] = useState(false);
  const [cryptoValue, setCryptoValue] = useState("");
  const [fiatOpen, setFiatOpen] = useState(false);
  const [fiatValue, setFiatValue] = useState("");

  return (
    <div className={`flex flex-col items-center min-w-min ${className}`}>
      <Card className="w-full">
        <CardHeader className="p-4">
          <CardTitle className="text-lg">Converter</CardTitle>
          <CardDescription></CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <Popover open={cryptoOpen} onOpenChange={setCryptoOpen}>
            <div className="flex flex-col items-center">
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={cryptoOpen}
                  className="w-[200px] justify-between"
                >
                  {cryptoValue
                    ? cryptoList.find((coin) => coin.value === cryptoValue)
                        ?.label
                    : "Select a coin..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
            </div>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search coins..." />
                <CommandEmpty>No coin found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {cryptoList.map((coin) => (
                      <CommandItem
                        key={coin.value}
                        value={coin.value}
                        onSelect={(currentValue) => {
                          setCryptoValue(
                            currentValue === cryptoValue ? "" : currentValue
                          );
                          setCryptoOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            cryptoValue === coin.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {coin.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Input className="my-4" />
          <svg
            className="w-4 h-4 mx-auto my-4"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M17 4V20M17 20L13 16M17 20L21 16M7 20V4M7 4L3 8M7 4L11 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <Input className="my-4" />
          <Popover open={fiatOpen} onOpenChange={setFiatOpen}>
            <div className="flex flex-col items-center">
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={fiatOpen}
                  className="w-[200px] justify-between"
                >
                  {fiatValue
                    ? fiatList.find((fiat) => fiat.value === fiatValue)?.label
                    : "Select a currency..."}
                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
              </PopoverTrigger>
            </div>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Search currencies..." />
                <CommandEmpty>No currency found.</CommandEmpty>
                <CommandGroup>
                  <CommandList>
                    {fiatList.map((fiat) => (
                      <CommandItem
                        key={fiat.value}
                        value={fiat.value}
                        onSelect={(currentValue) => {
                          setFiatValue(
                            currentValue === fiatValue ? "" : currentValue
                          );
                          setFiatOpen(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            fiatValue === fiat.value
                              ? "opacity-100"
                              : "opacity-0"
                          )}
                        />
                        {fiat.label}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </CardContent>
      </Card>
    </div>
  );
}
