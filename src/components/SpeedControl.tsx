import type { SpeedType } from "../utils/types";

interface SpeedControlProps {
  speed: SpeedType;
  setSpeed: (speed: SpeedType) => void;
}

export function SpeedControl({ speed, setSpeed }: SpeedControlProps) {
  const speedConfigs: {
    label: string;
    multiplier: string;
    value: SpeedType;
    activeClasses: string;
    textColor: string;
  }[] = [
    {
      label: "Slow",
      multiplier: "0.5×",
      value: 2,
      activeClasses:
        "bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-md shadow-amber-500/25 border-amber-400/40",
      textColor: "text-amber-400",
    },
    {
      label: "Medium",
      multiplier: "1.0×",
      value: 1,
      activeClasses:
        "bg-gradient-to-r from-sky-600 to-blue-500 text-white shadow-md shadow-sky-500/25 border-sky-400/40",
      textColor: "text-sky-400",
    },
    {
      label: "Fast",
      multiplier: "2.0×",
      value: 0.5,
      activeClasses:
        "bg-gradient-to-r from-emerald-600 to-teal-500 text-white shadow-md shadow-emerald-500/25 border-emerald-400/40",
      textColor: "text-emerald-400",
    },
  ];

  const currentConfig =
    speedConfigs.find((cfg) => cfg.value === speed) || speedConfigs[1];

  // Dynamic needle angle for speedometer SVG gauge:
  // Slow (2) => -45°
  // Medium (1) => 0°
  // Fast (0.5) => +45°
  const needleRotation = speed === 2 ? -45 : speed === 0.5 ? 45 : 0;

  return (
    <div className="flex flex-col bg-gray-800/85 p-1 sm:p-1.5 rounded-lg border border-gray-700/70 shadow-inner">
      {/* Header with Speedometer Gauge & Live Multiplier */}
      <div className="flex items-center justify-between px-1 pb-1 gap-2">
        <label className="text-xs sm:text-sm text-gray-300 font-semibold flex items-center gap-1.5 cursor-default">
          {/* Animated Speedometer / Tachometer Gauge Icon */}
          <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer gauge dial arc */}
              <path
                d="M19.07 4.93a10 10 0 0 0-14.14 0"
                className={
                  speed === 0.5
                    ? "stroke-emerald-400"
                    : speed === 2
                    ? "stroke-amber-400"
                    : "stroke-sky-400"
                }
              />
              <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              {/* Center Pivot Point */}
              <circle cx="12" cy="14" r="1.5" className="fill-current text-white" />
            </svg>
            {/* Rotating Gauge Needle */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-300 ease-out"
              style={{
                transform: `rotate(${needleRotation}deg)`,
                transformOrigin: "50% 60%",
              }}
            >
              <div
                className={`w-[2px] h-[7px] -translate-y-[3.5px] rounded-full shadow-sm ${
                  speed === 0.5
                    ? "bg-emerald-400 shadow-emerald-400"
                    : speed === 2
                    ? "bg-amber-400 shadow-amber-400"
                    : "bg-sky-400 shadow-sky-400"
                }`}
              />
            </div>
          </div>

          <span>Speed</span>
        </label>

        {/* Live Multiplier Badge */}
        <span
          className={`text-[10px] sm:text-xs font-mono font-bold px-1.5 py-0.2 rounded bg-gray-900/80 border border-gray-700/60 ${currentConfig.textColor}`}
        >
          {currentConfig.multiplier}
        </span>
      </div>

      {/* 1-Click Segmented Speed Pills */}
      <div className="flex items-center bg-gray-900/90 p-0.5 rounded-md border border-gray-700/80 shadow-inner gap-0.5">
        {speedConfigs.map((cfg) => {
          const isActive = speed === cfg.value;
          return (
            <button
              key={cfg.value}
              type="button"
              onClick={() => setSpeed(cfg.value)}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded text-xs sm:text-xs font-semibold transition-all duration-200 border flex items-center justify-center cursor-pointer select-none active:scale-95 ${
                isActive
                  ? `${cfg.activeClasses} scale-[1.02]`
                  : "border-transparent text-gray-400 hover:text-gray-200 hover:bg-gray-800/70"
              }`}
              title={`Switch speed to ${cfg.label} (${cfg.multiplier})`}
            >
              <span>{cfg.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
