import { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hoverable?: boolean;
}

export default function Card({ hoverable, className = "", style, children, ...props }: CardProps) {
  return (
    <div
      className={`rounded-[16px] p-6 ${hoverable ? "card-hover" : ""} ${className}`}
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}
