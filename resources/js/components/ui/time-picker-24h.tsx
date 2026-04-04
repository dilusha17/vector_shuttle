import * as React from "react";
import { cn } from "@/lib/utils";

const ITEM_H = 44;
const VISIBLE = 5;

const HOURS   = Array.from({ length: 24 }, (_, i) => i.toString().padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, "0"));

function ScrollColumn({
  items,
  selected,
  label,
  onSelect,
}: {
  items: string[];
  selected: string;
  label: string;
  onSelect: (v: string) => void;
}) {
  const ref   = React.useRef<HTMLDivElement>(null);
  const timer = React.useRef<ReturnType<typeof setTimeout>>();

  const scrollTo = React.useCallback((index: number, smooth = true) => {
    ref.current?.scrollTo({ top: index * ITEM_H, behavior: smooth ? "smooth" : "instant" as ScrollBehavior });
  }, []);

  // On mount: jump to initial selection without animation
  React.useEffect(() => {
    const idx = items.indexOf(selected);
    if (idx >= 0) scrollTo(idx, false);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleScroll = () => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (!ref.current) return;
      const idx     = Math.round(ref.current.scrollTop / ITEM_H);
      const clamped = Math.max(0, Math.min(idx, items.length - 1));
      scrollTo(clamped);
      onSelect(items[clamped]);
    }, 120);
  };

  const handleClick = (item: string) => {
    const idx = items.indexOf(item);
    scrollTo(idx);
    onSelect(item);
  };

  return (
    <div className="flex flex-col items-center gap-1.5">
      <div
        className="relative overflow-hidden"
        style={{ width: 56, height: ITEM_H * VISIBLE }}
      >
        {/* Center highlight ring */}
        <div
          className="absolute inset-x-1 rounded-lg bg-primary/15 border border-primary/30 pointer-events-none z-10"
          style={{ top: ITEM_H * 2, height: ITEM_H }}
        />
        {/* Fade — top */}
        <div
          className="absolute inset-x-0 top-0 pointer-events-none z-10 from-card to-transparent bg-gradient-to-b"
          style={{ height: ITEM_H * 1.8 }}
        />
        {/* Fade — bottom */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none z-10 from-card to-transparent bg-gradient-to-t"
          style={{ height: ITEM_H * 1.8 }}
        />
        {/* Scroll drum */}
        <div
          ref={ref}
          onScroll={handleScroll}
          className="h-full overflow-y-scroll [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          <div style={{ height: ITEM_H * 2 }} />
          {items.map((item) => (
            <div
              key={item}
              onClick={() => handleClick(item)}
              className={cn(
                "flex items-center justify-center font-mono text-xl font-semibold select-none cursor-pointer transition-colors duration-150",
                item === selected ? "text-foreground" : "text-muted-foreground/35"
              )}
              style={{ height: ITEM_H }}
            >
              {item}
            </div>
          ))}
          <div style={{ height: ITEM_H * 2 }} />
        </div>
      </div>
      <span className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</span>
    </div>
  );
}

interface TimePicker24hProps {
  value: string; // "HH:MM" 24h
  onChange: (time: string) => void;
  className?: string;
}

export function TimePicker24h({ value, onChange, className }: TimePicker24hProps) {
  const parseValue = () => {
    if (value) {
      const [h, m] = value.split(":");
      return {
        h: (h || "08").padStart(2, "0"),
        m: (m || "00").padStart(2, "0"),
      };
    }
    return { h: "08", m: "00" };
  };

  const init = parseValue();
  const [hour,   setHour]   = React.useState(init.h);
  const [minute, setMinute] = React.useState(init.m);

  const handleHour = (h: string) => { setHour(h);   onChange(`${h}:${minute}`); };
  const handleMin  = (m: string) => { setMinute(m); onChange(`${hour}:${m}`);   };

  return (
    <div className={cn("flex items-end justify-center gap-1 py-2 px-4", className)}>
      <ScrollColumn items={HOURS}   selected={hour}   label="HH" onSelect={handleHour} />
      <span className="pb-8 text-2xl font-bold text-muted-foreground">:</span>
      <ScrollColumn items={MINUTES} selected={minute} label="MM" onSelect={handleMin}  />
    </div>
  );
}
