import Navbar from "./Navbar.jsx";
import Sidebar from "./Sidebar.jsx";

/**
 * DashboardLayout — wraps the full app shell (Navbar + Sidebar + main content).
 * Children receive the activePage and setActivePage props for navigation.
 */
export default function DashboardLayout({ activePage, setActivePage, children }) {
    return (
        <div className="flex flex-col h-screen overflow-hidden">
            <Navbar />

            <div className="flex flex-1 min-h-0 overflow-hidden">
                <Sidebar activePage={activePage} setActivePage={setActivePage} />

                <main className="flex-1 min-h-0 flex flex-col overflow-hidden bg-gradient-to-br from-gray-950 via-gray-950 to-gray-900">
                    {children}
                </main>
            </div>
        </div>
    );
}
