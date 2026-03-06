import { Toaster } from "react-hot-toast";

/**
 * Toast — re-exports react-hot-toast's Toaster, styled to match the design system.
 * Also re-exports toast for use throughout the app.
 */
export { default as toast } from "react-hot-toast";

export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
                duration: 3500,
                style: {
                    background: "rgba(17, 24, 39, 0.95)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(55, 65, 81, 0.6)",
                    color: "#e5e7eb",
                    fontSize: "13px",
                    fontWeight: "500",
                    borderRadius: "12px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.2)",
                    padding: "10px 14px",
                    maxWidth: "380px",
                },
                success: {
                    iconTheme: { primary: "#10b981", secondary: "rgba(17, 24, 39, 0.95)" },
                    style: {
                        borderColor: "rgba(16, 185, 129, 0.2)",
                    },
                },
                error: {
                    iconTheme: { primary: "#ef4444", secondary: "rgba(17, 24, 39, 0.95)" },
                    style: {
                        borderColor: "rgba(239, 68, 68, 0.2)",
                    },
                },
            }}
        />
    );
}
