import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown } from "lucide-react";

interface TimePickerProps {
  value: string;
  onChange: (time: string) => void;
  className?: string;
}

export function TimePicker({ value, onChange, className }: TimePickerProps) {
  const [hour, setHour] = React.useState(12);
  const [minute, setMinute] = React.useState(0);
  const [period, setPeriod] = React.useState<"AM" | "PM">("AM");

  // Parse initial value
  React.useEffect(() => {
    if (value) {
      const [h, m] = value.split(":").map(Number);
      const isPM = h >= 12;
      const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h === 12 ? 12 : h;
      setHour(hour12);
      setMinute(m);
      setPeriod(isPM ? "PM" : "AM");
    }
  }, []);

  const updateTime = (newHour: number, newMinute: number, newPeriod: "AM" | "PM") => {
    let hour24 = newHour;
    if (newPeriod === "PM" && newHour !== 12) {
      hour24 = newHour + 12;
    } else if (newPeriod === "AM" && newHour === 12) {
      hour24 = 0;
    }
    const timeString = `${hour24.toString().padStart(2, "0")}:${newMinute.toString().padStart(2, "0")}`;
    onChange(timeString);
  };

  const incrementHour = () => {
    const newHour = hour === 12 ? 1 : hour + 1;
    setHour(newHour);
    updateTime(newHour, minute, period);
  };

  const decrementHour = () => {
    const newHour = hour === 1 ? 12 : hour - 1;
    setHour(newHour);
    updateTime(newHour, minute, period);
  };

  const incrementMinute = () => {
    const newMinute = minute === 55 ? 0 : minute + 5;
    setMinute(newMinute);
    updateTime(hour, newMinute, period);
  };

  const decrementMinute = () => {
    const newMinute = minute === 0 ? 55 : minute - 5;
    setMinute(newMinute);
    updateTime(hour, newMinute, period);
  };

  const togglePeriod = () => {
    const newPeriod = period === "AM" ? "PM" : "AM";
    setPeriod(newPeriod);
    updateTime(hour, minute, newPeriod);
  };

  const SpinnerButton = ({ onClick, children, className: btnClass }: { onClick: () => void; children: React.ReactNode; className?: string }) => (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "p-1 rounded-md hover:bg-primary/20 text-muted-foreground hover:text-primary transition-colors",
        btnClass
      )}
    >
      {children}
    </button>
  );

  return (
    <div className={cn("flex items-center justify-center gap-2 p-4", className)}>
      {/* Hour */}
      <div className="flex flex-col items-center">
        <SpinnerButton onClick={incrementHour}>
          <ChevronUp className="h-5 w-5" />
        </SpinnerButton>
        <div className="w-14 h-14 flex items-center justify-center bg-secondary rounded-xl text-2xl font-semibold text-foreground">
          {hour.toString().padStart(2, "0")}
        </div>
        <SpinnerButton onClick={decrementHour}>
          <ChevronDown className="h-5 w-5" />
        </SpinnerButton>
      </div>

      <span className="text-2xl font-bold text-muted-foreground">:</span>

      {/* Minute */}
      <div className="flex flex-col items-center">
        <SpinnerButton onClick={incrementMinute}>
          <ChevronUp className="h-5 w-5" />
        </SpinnerButton>
        <div className="w-14 h-14 flex items-center justify-center bg-secondary rounded-xl text-2xl font-semibold text-foreground">
          {minute.toString().padStart(2, "0")}
        </div>
        <SpinnerButton onClick={decrementMinute}>
          <ChevronDown className="h-5 w-5" />
        </SpinnerButton>
      </div>

      {/* AM/PM */}
      <div className="flex flex-col items-center ml-2">
        <SpinnerButton onClick={togglePeriod}>
          <ChevronUp className="h-5 w-5" />
        </SpinnerButton>
        <div 
          onClick={togglePeriod}
          className="w-14 h-14 flex items-center justify-center bg-primary/20 rounded-xl text-lg font-bold text-primary cursor-pointer hover:bg-primary/30 transition-colors"
        >
          {period}
        </div>
        <SpinnerButton onClick={togglePeriod}>
          <ChevronDown className="h-5 w-5" />
        </SpinnerButton>
      </div>
    </div>
  );
}
