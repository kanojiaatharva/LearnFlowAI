import { ToastProvider } from "../features/common/Toast.jsx";

/**
 * Providers — wraps the app with global context/notification providers.
 */
export default function Providers({ children }) {
    return (
        <>
            {children}
            <ToastProvider />
        </>
    );
}
