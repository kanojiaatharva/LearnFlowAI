/**
 * SkillSelector — pill-style skill level chooser.
 */
const SKILL_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const LEVEL_META = {
    Beginner: { color: "emerald", desc: "Simple analogies, no jargon" },
    Intermediate: { color: "blue", desc: "Balanced depth & clarity" },
    Advanced: { color: "violet", desc: "Technical, precise details" },
    Expert: { color: "amber", desc: "Deep-dive, nuanced analysis" },
};

export default function SkillSelector({ value, onChange, disabled }) {
    return (
        <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-medium text-gray-500 shrink-0">Skill Level:</span>
            <div className="flex gap-1.5 flex-wrap">
                {SKILL_LEVELS.map((level) => {
                    const isActive = value === level;
                    return (
                        <button
                            key={level}
                            onClick={() => !disabled && onChange(level)}
                            disabled={disabled}
                            title={LEVEL_META[level].desc}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all duration-200 disabled:cursor-not-allowed ${isActive
                                    ? "bg-violet-600/20 border-violet-500/40 text-violet-300 shadow-sm shadow-violet-900/20"
                                    : "bg-gray-800/40 border-gray-700/50 text-gray-400 hover:border-gray-600 hover:text-gray-200"
                                }`}
                        >
                            {level}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}
