import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";
import { FixedSizeList as List } from "react-window";
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

interface SelectorDropdownProps {
  label: string;
  items: string[];
  value: string;
  onChange: (value: string) => void;
}

export default function SelectorDropdown({
  label,
  items,
  value,
  onChange,
}: SelectorDropdownProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState("");

  const filteredItems = items.filter((item) =>
    item.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="mx-auto w-full"
        >
          {value || label}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <input
              type="text"
              placeholder={`${label}...`}
              value={filter}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFilter(e.target.value)
              }
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
          <CommandGroup>
            <CommandList>
              <List
                height={200}
                itemCount={filteredItems.length}
                itemSize={35}
                width="100%"
              >
                {({ index, style }) => {
                  const item = filteredItems[index];
                  return (
                    <CommandItem
                      key={item}
                      value={item}
                      style={style}
                      onSelect={() => {
                        onChange(item === value ? "" : item);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          item === value ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      {item}
                    </CommandItem>
                  );
                }}
              </List>
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
