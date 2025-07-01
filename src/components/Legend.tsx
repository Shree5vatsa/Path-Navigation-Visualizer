import {
  startTileStyle,
  wallTileStyle,
  traversedTileStyle,
  pathTileStyle,
  endTileStyle,
} from "../utils/constants";

export function Legend() {
  const legendItems = [
    { label: "Start/End", style: startTileStyle, color: "bg-green-400" },
    { label: "End", style: endTileStyle, color: "bg-red-400" },
    { label: "Wall", style: wallTileStyle, color: "bg-gray-300" },
    { label: "Visited", style: traversedTileStyle, color: "bg-cyan-400" },
    { label: "Shortest Path", style: pathTileStyle, color: "bg-green-500" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-800 text-white border-t border-gray-600">
      <div className="flex items-center justify-center gap-6 py-3 px-4">
        {legendItems.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div
              className={`w-4 h-4 border border-gray-400 ${item.color}`}
            ></div>
            <span className="text-sm">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
