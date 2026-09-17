export function Legend() {
  const legendItems = [
    {
      label: "Start Node",
      color: "bg-green-400 ring-1 ring-green-300 shadow-[0_0_8px_rgba(74,222,128,0.5)]",
    },
    {
      label: "Target Node",
      color: "bg-red-400 ring-1 ring-red-300 shadow-[0_0_8px_rgba(248,113,113,0.5)]",
    },
    {
      label: "Wall Node",
      color: "bg-gray-300 ring-1 ring-gray-400 shadow-sm",
    },
    {
      label: "Visited Node",
      color: "bg-cyan-400 ring-1 ring-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.4)]",
    },
    {
      label: "Shortest Path",
      color: "bg-green-500 ring-1 ring-emerald-300 shadow-[0_0_8px_rgba(34,197,94,0.5)]",
    },
    {
      label: "Unvisited",
      color: "bg-gray-900 border border-sky-400/50 shadow-inner",
    },
  ];

  return (
    <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 sm:gap-x-5 py-0.5">
      <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-sky-400">
        Index:
      </span>
      {legendItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-1.5 bg-gray-800/60 px-2 py-0.5 sm:py-1 rounded-md border border-gray-700/60 hover:bg-gray-800 transition-colors shadow-sm"
        >
          <div
            className={`w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-[2px] transition-transform hover:scale-110 ${item.color}`}
          />
          <span className="text-[11px] sm:text-xs font-semibold text-gray-200 whitespace-nowrap">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

