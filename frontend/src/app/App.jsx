import { useState } from "react";
import Sidebar from "../layout/Sidebar.jsx";
import Navbar from "../layout/Navbar.jsx";
import ExplainPage from "../features/explain/ExplainPage.jsx";
import ChatPage from "../features/chat/ChatPage.jsx";
import UploadPage from "../features/upload/UploadPage.jsx";

export default function App() {
    const [page, setPage] = useState("explain");

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "hidden", background: "#030712" }}>
            <Navbar />
            <div style={{ display: "flex", flex: 1, minHeight: 0, overflow: "hidden" }}>
                <Sidebar activePage={page} onNavigate={setPage} />
                <main style={{ flex: 1, minHeight: 0, display: "flex", flexDirection: "column", overflow: "hidden" }}>
                    {page === "explain" && (
                        <div style={{ flex: 1, overflowY: "auto" }}>
                            <ExplainPage />
                        </div>
                    )}
                    {page === "qa" && (
                        <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, overflow: "hidden" }}>
                            <ChatPage />
                        </div>
                    )}
                    {page === "upload" && (
                        <div style={{ flex: 1, overflowY: "auto" }}>
                            <UploadPage />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
