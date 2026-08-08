"use client";

import { useState } from "react";
import { Check, ChevronsUpDown } from "lucide-react";

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
import { COUNTRIES } from "@/lib/countries";
import { cn } from "@/lib/utils";

/**
 * Searchable country picker over the real world-countries dataset.
 * Every real place on earth, including territories — the full list.
 */
export function CountryPicker({
  value,
  onValueChange,
  id,
  placeholder = "Search 250 countries…",
  className,
}: {
  value: string;
  onValueChange: (name: string) => void;
  id?: string;
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const selected = COUNTRIES.find((c) => c.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger
        id={id}
        role="combobox"
        aria-expanded={open}
        className={cn(
          "flex h-11 w-full cursor-pointer items-center justify-between border-2 border-ink/30 bg-paper px-3 text-left text-sm text-ink outline-none transition-colors hover:border-ink/50 focus-visible:ring-2 focus-visible:ring-amber focus-visible:ring-offset-2 focus-visible:ring-offset-paper",
          !selected && "text-ink/45",
          className
        )}
      >
        {selected ? (
          <span className="flex items-center gap-2.5">
            <span className="board text-[11px] tracking-[0.15em] text-amber-deep">
              {selected.code}
            </span>
            {selected.name}
          </span>
        ) : (
          placeholder
        )}
        <ChevronsUpDown className="size-4 shrink-0 text-ink/40" aria-hidden />
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0">
        <Command>
          <CommandInput placeholder={placeholder} aria-label="Search countries" />
          <CommandList>
            <CommandEmpty>No place found — it&apos;s all real, check the spelling.</CommandEmpty>
            <CommandGroup>
              {COUNTRIES.map((c) => (
                <CommandItem
                  key={c.code}
                  value={`${c.name} ${c.code}`}
                  onSelect={() => {
                    onValueChange(c.name);
                    setOpen(false);
                  }}
                >
                  <span className="board w-8 shrink-0 text-[10px] tracking-[0.15em] text-amber-deep">
                    {c.code}
                  </span>
                  <span className="flex-1 truncate">{c.name}</span>
                  {c.name === value && (
                    <Check className="size-4 shrink-0 text-signal" aria-hidden />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
