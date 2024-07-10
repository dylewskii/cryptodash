// react
import { useState } from "react";
import { FixedSizeList as List } from "react-window";
// ui
import { Check, ChevronsUpDown } from "lucide-react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
// hook & type
import { useCoinSearch, AddedCoin } from "@/hooks/useCoinSearch";

interface SelectorDropdownProps {
  className?: string;
  label: string;
  value: string | null;
  onChange: (value: AddedCoin) => void;
}

export default function SelectorDropdown({
  className,
  label,
  value,
  onChange,
}: SelectorDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { searchResults } = useCoinSearch(query);

  const selectedCoin = searchResults.find((coin) => coin.id === value);

  return (
    <div className={`${className}`}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {/* ---- SELECTOR BUTTON WITH LABEL OR COIN NAME ----*/}
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="mx-auto w-full"
          >
            {selectedCoin ? selectedCoin.name : label}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[275px] p-0">
          <Command>
            <div className="flex items-center border-b px-3">
              {/* ---- SEARCHBOX ----*/}
              <input
                id="itemSelection"
                type="text"
                placeholder={`${label}...`}
                value={query}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setQuery(e.target.value)
                }
                className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
            <CommandGroup>
              {/* ---- COIN LIST ----*/}
              <CommandList>
                <List
                  height={200}
                  itemCount={searchResults.length}
                  itemSize={35}
                  width="100%"
                >
                  {({ index, style }) => {
                    const item = searchResults[index];
                    return (
                      <>
                        <CommandItem
                          className=""
                          key={item.id}
                          value={item.id}
                          style={style}
                          onSelect={() => {
                            onChange(item);
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={`mr-2 h-4 w-4 ${
                              item.id === value ? "opacity-100" : "opacity-0"
                            }`}
                          />
                          {item.thumb ? (
                            <img
                              src={`${item.thumb}`}
                              alt="Cryptocurrency Logo"
                              className="z-10 max-w-[25px] pr-2"
                            />
                          ) : null}
                          {item.name}
                        </CommandItem>
                      </>
                    );
                  }}
                </List>
              </CommandList>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}
