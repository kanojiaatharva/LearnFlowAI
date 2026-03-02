import { useState } from "react";
import Navbar from "./layout/Navbar.jsx";
import Sidebar from "./layout/Sidebar.jsx";
import ExplainPage from "./pages/ExplainPage.jsx";
import QAPage from "./pages/QAPage.jsx";

export default function App() {
    const [activePage, setActivePage] = useState("explain");

    const renderPage = () => {
        switch (activePage) {
            case "explain":
                return <ExplainPage />;
            case "qa":
                return <QAPage />;
            default:
                return <ExplainPage />;
        }
    };

    return (
        <div className="flex flex-col h-screen overflow-hidden bg-gray-950">
            <Navbar />
            <div className="flex flex-1 min-h-0 overflow-hidden">
                <Sidebar activePage={activePage} setActivePage={setActivePage} />
                <main
                    className={`flex-1 overflow-auto bg-gradient-to-br from-gray-950 via-gray-900/30 to-gray-950 ${activePage === "qa" ? "flex flex-col overflow-hidden" : ""
                        }`}
                >
                    {renderPage()}
                </main>
            </div>
        </div>
    );
}