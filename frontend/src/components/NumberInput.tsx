import { Input } from "@/components/ui/input";
import { forwardRef } from "react";

interface NumberInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange' | 'value'> {
  value?: number;
  onChange?: (value: number | undefined) => void;
  suffix?: string;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  ({ value, onChange, suffix, className, ...props }, ref) => {
    return (
      <div className="relative">
        <Input
          ref={ref}
          type="number"
          value={value ?? ""}
          onChange={(e) => {
            const val = e.target.value;
            onChange?.(val === "" ? undefined : Number(val));
          }}
          className={suffix ? `pr-12 ${className || ""}` : className}
          {...props}
        />
        {suffix && (
          <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500">
            {suffix}
          </span>
        )}
      </div>
    );
  }
);

NumberInput.displayName = "NumberInput";
