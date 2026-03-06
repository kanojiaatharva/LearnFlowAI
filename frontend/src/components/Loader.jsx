export default function Loader({ message = "Generating response..." }) {
    return (
        <div className="flex items-center gap-3 p-4 glass-card">
            <div className="flex gap-1">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "0ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "150ms" }}></span>
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: "300ms" }}></span>
            </div>
            <p className="text-sm text-gray-400 font-medium">{message}</p>
        </div>
    );
}
