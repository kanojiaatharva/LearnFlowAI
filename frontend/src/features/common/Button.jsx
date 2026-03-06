/**
 * Button — reusable button with variants, sizes, loading state, and ripple effect.
 */
export default function Button({
    children,
    variant = "primary",
    size = "md",
    loading = false,
    disabled = false,
    onClick,
    type = "button",
    className = "",
    ...props
}) {
    const variantClass = {
        primary: "btn-primary",
        secondary: "btn-secondary",
        ghost: "btn-ghost",
        danger: "btn-danger",
    }[variant] ?? "btn-primary";

    const sizeClass = {
        sm: "text-xs py-1.5 px-3",
        md: "",
        lg: "text-base py-3 px-6",
    }[size] ?? "";

    const handleClick = (e) => {
        if (loading || disabled) return;
        // Ripple effect
        const btn = e.currentTarget;
        const circle = document.createElement("span");
        const diameter = Math.max(btn.clientWidth, btn.clientHeight);
        const radius = diameter / 2;
        const rect = btn.getBoundingClientRect();
        circle.style.cssText = `
      width: ${diameter}px; height: ${diameter}px;
      left: ${e.clientX - rect.left - radius}px;
      top: ${e.clientY - rect.top - radius}px;
      position: absolute; border-radius: 50%;
      background: rgba(255,255,255,0.15);
      transform: scale(0); animation: ripple 0.5s linear;
      pointer-events: none;
    `;
        btn.appendChild(circle);
        setTimeout(() => circle.remove(), 500);
        onClick?.(e);
    };

    return (
        <button
            type={type}
            disabled={disabled || loading}
            onClick={handleClick}
            className={`${variantClass} ${sizeClass} ${className}`}
            {...props}
        >
            {loading && (
                <svg className="animate-spin w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5"
                        strokeLinecap="round" strokeDasharray="28" strokeDashoffset="8" />
                </svg>
            )}
            {children}
        </button>
    );
}
