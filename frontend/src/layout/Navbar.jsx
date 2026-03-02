export default function Navbar() {
    return (
        <header className="h-14 border-b border-gray-800/60 bg-gray-950/80 backdrop-blur-md flex items-center px-6 justify-between sticky top-0 z-50">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-900/30">
                    <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-white" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
                <span className="font-bold text-white text-[15px] tracking-tight">
                    LearnFlow <span className="text-violet-400">AI</span>
                </span>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium px-3 py-1.5 rounded-full">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    AI Ready
                </div>

                {/* Avatar */}
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-600 flex items-center justify-center text-white font-semibold text-xs shadow-sm cursor-pointer ring-2 ring-gray-800 hover:ring-violet-500/40 transition-all">
                    A
                </div>
            </div>
        </header>
    );
}
