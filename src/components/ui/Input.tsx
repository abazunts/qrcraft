import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, className = "", id, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          className={`w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-200 ${className}`}
          style={{
            background: "var(--surface2)",
            border: "1px solid var(--border)",
            color: "var(--text)",
          }}
          onFocus={(e) => {
            e.target.style.borderColor = "rgba(124,58,237,0.6)";
          }}
          onBlur={(e) => {
            e.target.style.borderColor = "var(--border)";
          }}
          {...props}
        />
      </div>
    );
  }
);

Input.displayName = "Input";
export default Input;
