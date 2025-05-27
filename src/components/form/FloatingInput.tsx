import * as React from "react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FloatingInputProps {
  id: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
  icon?: ReactNode;
  maxLength?: number;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
  error?: string;
  placeholder?: string; // Add placeholder prop
}

const FloatingInput = React.forwardRef<HTMLInputElement, FloatingInputProps>(
  ({ label, type = "text", className, error, placeholder, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [value, setValue] = React.useState("");
    const inputId = React.useId();

    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(!!value);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setValue(e.target.value);
    };

    return (
      <div className="relative">
        <input
          type={type}
          id={inputId}
          className={cn(
            "peer block w-full appearance-none border-0 border-b-2 border-input bg-transparent px-0 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-0",
            error && "border-destructive focus:border-destructive",
            className
          )}
          ref={ref}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={placeholder} // Pass placeholder to input
          {...props}
        />
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              "absolute left-0 top-2.5 -translate-y-5 scale-75 transform text-sm font-semibold text-muted-foreground transition-all duration-150 ease-in-out peer-focus:-translate-y-5 peer-focus:scale-75 peer-focus:font-medium peer-focus:text-primary",
              (isFocused || value) && "-translate-y-5 scale-75 font-medium",
              error && "text-destructive peer-focus:text-destructive"
            )}
          >
            {label}
          </label>
        )}
        {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
      </div>
    );
  }
);

FloatingInput.displayName = "FloatingInput";

export { FloatingInput };