/**
 * Card — glassmorphism card with optional neon glow variant.
 */
export default function Card({ children, glow = false, className = "", ...props }) {
    return (
        <div
            className={`${glow ? "glass-card-glow" : "glass-card"} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
}
