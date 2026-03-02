const NAV_ITEMS = [
    {
        id: "explain",
        label: "Explain Content",
        disabled: false,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12h6M9 16h6M17 21H7a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "qa",
        label: "Q&A Assistant",
        disabled: false,
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "path",
        label: "Learning Path",
        disabled: true,
        badge: "Soon",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
    {
        id: "progress",
        label: "Progress",
        disabled: true,
        badge: "Soon",
        icon: (
            <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
    },
];

export default function Sidebar({ activePage, setActivePage }) {
    return (
        <aside className="w-60 shrink-0 border-r border-gray-800/60 bg-gray-950 flex flex-col min-h-0">
            {/* Nav section */}
            <div className="flex-1 p-3 space-y-1 pt-4">
                <p className="text-xs font-semibold text-gray-600 uppercase tracking-wider px-3 mb-3">
                    Workspace
                </p>

                {NAV_ITEMS.map((item) => {
                    const isActive = activePage === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => !item.disabled && setActivePage(item.id)}
                            disabled={item.disabled}
                            className={`nav-item w-full ${item.disabled
                                    ? "nav-item-disabled"
                                    : isActive
                                        ? "nav-item-active"
                                        : "nav-item-inactive"
                                }`}
                        >
                            <span
                                className={
                                    isActive
                                        ? "text-violet-400"
                                        : item.disabled
                                            ? "text-gray-600"
                                            : "text-gray-500"
                                }
                            >
                                {item.icon}
                            </span>
                            <span className="flex-1 text-left">{item.label}</span>
                            {item.badge && (
                                <span className="badge bg-gray-800 text-gray-500 border border-gray-700">
                                    {item.badge}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-800/60">
                <div className="glass-card p-3 space-y-1.5">
                    <p className="text-xs font-semibold text-gray-300">LearnFlow AI</p>
                    <p className="text-xs text-gray-500 leading-relaxed">
                        AI-powered learning assistant. Explain any technical content instantly.
                    </p>
                    <div className="flex gap-1 pt-1">
                        <span className="badge bg-violet-500/10 text-violet-400 border border-violet-500/20">v1.0</span>
                        <span className="badge bg-gray-800 text-gray-500 border border-gray-700">Beta</span>
                    </div>
                </div>
            </div>
        </aside>
    );
}
