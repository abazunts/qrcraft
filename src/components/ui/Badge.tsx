interface BadgeProps {
  children: React.ReactNode;
  variant?: "purple" | "green" | "gray";
}

const variants = {
  purple: {
    background: "rgba(124,58,237,0.15)",
    color: "var(--purple-light)",
    border: "1px solid rgba(124,58,237,0.3)",
  },
  green: {
    background: "rgba(34,197,94,0.15)",
    color: "#4ade80",
    border: "1px solid rgba(34,197,94,0.3)",
  },
  gray: {
    background: "var(--surface2)",
    color: "var(--muted)",
    border: "1px solid var(--border)",
  },
};

export default function Badge({ children, variant = "gray" }: BadgeProps) {
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
      style={variants[variant]}
    >
      {children}
    </span>
  );
}
