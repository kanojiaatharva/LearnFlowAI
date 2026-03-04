import { useState } from "react";
import Navbar from "./layout/Navbar.jsx";
import Sidebar from "./layout/Sidebar.jsx";
import ExplainPage from "./pages/ExplainPage.jsx";
import QAPage from "./pages/QAPage.jsx";

export default function App() {
    const [activePage, setActivePage] = useState("explain");

    return (
        /* Root: full-screen flex column */
        <div className="flex flex-col h-screen overflow-hidden bg-gray-950">
            <Navbar />

            {/* Body row: sidebar + main (both fill remaining height) */}
            <div className="flex flex-1 min-h-0 overflow-hidden">
                <Sidebar activePage={activePage} setActivePage={setActivePage} />

                {/*
          Main always uses flex-col + overflow-hidden so child pages own
          their own scroll behaviour. ExplainPage scrolls its own content;
          QAPage pins input at the bottom.
        */}
                <main className="flex-1 min-h-0 flex flex-col overflow-hidden bg-gradient-to-br from-gray-950 via-gray-900/20 to-gray-950">
                    {activePage === "explain" && (
                        /* ExplainPage needs an outer scroll wrapper */
                        <div className="flex-1 overflow-y-auto">
                            <ExplainPage />
                        </div>
                    )}
                    {activePage === "qa" && (
                        /* QAPage fills full height and handles its own scroll */
                        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                            <QAPage />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}