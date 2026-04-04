import * as React from "react";
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
import { countryCodes } from "@/lib/countryCodes";

interface PhoneCountrySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

// value and onChange use a unique "code||country" key (e.g. "+1||United States")
// so that countries sharing the same dial code are distinguished unambiguously.
export function PhoneCountrySelect({ value, onChange, className }: PhoneCountrySelectProps) {
  const [open, setOpen] = React.useState(false);

  const selected = React.useMemo(() => {
    if (!value) return undefined;
    const [code, ...rest] = value.split("||");
    const country = rest.join("||");
    return countryCodes.find((c) => c.code === code && c.country === country)
      ?? countryCodes.find((c) => c.code === code);
  }, [value]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "h-12 px-3 justify-between bg-secondary border-border hover:bg-secondary/80 text-foreground font-normal gap-1",
            className
          )}
        >
          <span className="flex items-center gap-1.5 truncate">
            {selected ? (
              <>
                <span>{selected.flag}</span>
                <span className="font-medium">{selected.code}</span>
              </>
            ) : (
              <span className="text-muted-foreground">Code</span>
            )}
          </span>
          <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-[280px] p-0 bg-card border-border"
        align="start"
        side="bottom"
        avoidCollisions
      >
        <Command
          filter={(itemValue, search) => {
            const item = countryCodes.find((c) => `${c.country}||${c.code}` === itemValue);
            if (!item) return 0;
            const q = search.toLowerCase();
            return item.country.toLowerCase().includes(q) || item.code.includes(q) ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Search country..." className="h-10" />
          <CommandList className="max-h-52 overflow-y-auto">
            <CommandEmpty>No country found.</CommandEmpty>
            <CommandGroup>
              {countryCodes.map((c) => {
                const key = `${c.code}||${c.country}`;
                return (
                  <CommandItem
                    key={key}
                    value={`${c.country}||${c.code}`}
                    onSelect={() => {
                      onChange(key);
                      setOpen(false);
                    }}
                    className="cursor-pointer flex items-center gap-2 py-2"
                  >
                    <span className="text-base">{c.flag}</span>
                    <span className="flex-1 text-sm">{c.country}</span>
                    <span className="text-sm text-muted-foreground">{c.code}</span>
                    <Check
                      className={cn(
                        "h-4 w-4 text-primary ml-1 shrink-0",
                        value === key ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                );
              })}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
