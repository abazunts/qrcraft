import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const variantStyles: Record<NonNullable<ButtonProps["variant"]>, React.CSSProperties> = {
  primary: {
    background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
    color: "#fff",
    border: "none",
    boxShadow: "0 0 24px rgba(124,58,237,0.35)",
  },
  ghost: {
    background: "transparent",
    color: "var(--muted)",
    border: "1px solid var(--border)",
  },
  danger: {
    background: "transparent",
    color: "#ef4444",
    border: "1px solid #ef4444",
  },
};

const sizeStyles: Record<NonNullable<ButtonProps["size"]>, string> = {
  sm: "px-3 py-1.5 text-xs rounded-lg",
  md: "px-[22px] py-[10px] text-sm rounded-xl",
  lg: "px-9 py-4 text-base rounded-[14px]",
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", style, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center gap-2 font-semibold cursor-pointer transition-all duration-200 ${sizeStyles[size]} ${className}`}
        style={{ ...variantStyles[variant], ...style }}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
