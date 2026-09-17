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
  }[] = [
    {
      label: "Slow",
      multiplier: "0.5×",
      value: 2,
    },
    {
      label: "Medium",
      multiplier: "1.0×",
      value: 1,
    },
    {
      label: "Fast",
      multiplier: "2.0×",
      value: 0.5,
    },
  ];

  const currentConfig =
    speedConfigs.find((cfg) => cfg.value === speed) || speedConfigs[1];

  const needleRotation = speed === 2 ? -45 : speed === 0.5 ? 45 : 0;

  return (
    <div className="flex flex-col bg-zinc-800/90 p-1 sm:p-1.5 rounded-lg border border-zinc-700/80 shadow-xs">
      {/* Header with Speedometer Gauge & Live Multiplier */}
      <div className="flex items-center justify-between px-1 pb-1 gap-2">
        <label className="text-xs text-zinc-300 font-medium flex items-center gap-1.5 cursor-default">
          {/* Tachometer Gauge Icon */}
          <div className="relative w-4 h-4 sm:w-4.5 sm:h-4.5 flex items-center justify-center">
            <svg
              className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-zinc-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19.07 4.93a10 10 0 0 0-14.14 0" className="stroke-indigo-400" />
              <path d="M4.93 19.07a10 10 0 0 1 0-14.14" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
              <circle cx="12" cy="14" r="1.5" className="fill-current text-zinc-200" />
            </svg>
            {/* Rotating Needle */}
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-200 ease-out"
              style={{
                transform: `rotate(${needleRotation}deg)`,
                transformOrigin: "50% 60%",
              }}
            >
              <div className="w-[2px] h-[7px] -translate-y-[3.5px] rounded-full bg-indigo-400" />
            </div>
          </div>

          <span>Speed</span>
        </label>

        {/* Live Multiplier Badge */}
        <span className="text-[10px] font-mono font-semibold px-1.5 py-0.2 rounded bg-zinc-900 text-indigo-400 border border-zinc-700">
          {currentConfig.multiplier}
        </span>
      </div>

      {/* 1-Click Segmented Speed Control */}
      <div className="flex items-center bg-zinc-900 p-0.5 rounded border border-zinc-700/80 gap-0.5">
        {speedConfigs.map((cfg) => {
          const isActive = speed === cfg.value;
          return (
            <button
              key={cfg.value}
              type="button"
              onClick={() => setSpeed(cfg.value)}
              className={`px-2.5 py-0.5 sm:px-3 sm:py-1 rounded text-xs font-medium transition-all duration-150 border flex items-center justify-center cursor-pointer select-none ${
                isActive
                  ? "bg-zinc-700 text-zinc-100 border-zinc-600 shadow-xs"
                  : "border-transparent text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
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
