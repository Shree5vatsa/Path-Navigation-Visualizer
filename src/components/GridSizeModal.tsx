import { useState } from "react";
import {
  GRID_SIZE_PRESETS,
  MAX_GRID_COLS,
  MAX_GRID_ROWS,
  MIN_GRID_COLS,
  MIN_GRID_ROWS,
} from "../utils/constants";

interface GridSizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRows: number;
  currentCols: number;
  onApply: (rows: number, cols: number) => void;
}

export function GridSizeModal({
  isOpen,
  onClose,
  currentRows,
  currentCols,
  onApply,
}: GridSizeModalProps) {
  const [rows, setRows] = useState<number>(currentRows);
  const [cols, setCols] = useState<number>(currentCols);

  if (!isOpen) return null;

  // Compute odd dimensions for safe maze preview
  const safeRows = rows % 2 === 0 ? rows + 1 : rows;
  const safeCols = cols % 2 === 0 ? cols + 1 : cols;
  const startPos = `(1, 1)`;
  const goalPos = `(${safeRows - 2}, ${safeCols - 2})`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApply(safeRows, safeCols);
    onClose();
  };

  const handlePresetSelect = (presetRows: number, presetCols: number) => {
    setRows(presetRows);
    setCols(presetCols);
  };

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl max-w-md w-full p-5 sm:p-6 text-white space-y-4 relative animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📐</span>
            <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
              Customize Grid Dimensions
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-800 transition-colors text-lg leading-none"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Quick Presets */}
        <div>
          <label className="text-xs text-gray-400 font-semibold block mb-2">
            Quick Presets
          </label>
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
            {GRID_SIZE_PRESETS.map((p) => {
              const isSelected = safeRows === p.rows && safeCols === p.cols;
              return (
                <button
                  key={`${p.rows}x${p.cols}`}
                  type="button"
                  onClick={() => handlePresetSelect(p.rows, p.cols)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all text-center border ${
                    isSelected
                      ? "bg-sky-600/30 border-sky-400 text-sky-200 shadow-sm"
                      : "bg-gray-800/80 border-gray-700 text-gray-300 hover:bg-gray-700/80 hover:text-white"
                  }`}
                >
                  <div className="font-bold">{p.rows} × {p.cols}</div>
                  <div className="text-[10px] opacity-75">{p.name.split(" ")[2] || p.name.split(" ")[1] || ""}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Custom Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3 bg-gray-950/60 p-3 sm:p-4 rounded-xl border border-gray-800">
            {/* Rows Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs sm:text-sm font-medium text-gray-300">
                  Rows <span className="text-gray-500 font-normal">({MIN_GRID_ROWS} - {MAX_GRID_ROWS})</span>
                </label>
                <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 px-2 py-0.5 rounded border border-sky-800/60">
                  {safeRows}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={MIN_GRID_ROWS}
                  max={MAX_GRID_ROWS}
                  step={2}
                  value={safeRows}
                  onChange={(e) => setRows(Number(e.target.value))}
                  className="flex-1 accent-sky-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min={MIN_GRID_ROWS}
                  max={MAX_GRID_ROWS}
                  step={2}
                  value={safeRows}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setRows(val);
                  }}
                  className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-center text-xs sm:text-sm text-white font-mono focus:border-sky-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Columns Input */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs sm:text-sm font-medium text-gray-300">
                  Columns <span className="text-gray-500 font-normal">({MIN_GRID_COLS} - {MAX_GRID_COLS})</span>
                </label>
                <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                  {safeCols}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min={MIN_GRID_COLS}
                  max={MAX_GRID_COLS}
                  step={2}
                  value={safeCols}
                  onChange={(e) => setCols(Number(e.target.value))}
                  className="flex-1 accent-cyan-400 h-1.5 bg-gray-700 rounded-lg cursor-pointer"
                />
                <input
                  type="number"
                  min={MIN_GRID_COLS}
                  max={MAX_GRID_COLS}
                  step={2}
                  value={safeCols}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    if (!isNaN(val)) setCols(val);
                  }}
                  className="w-16 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1 text-center text-xs sm:text-sm text-white font-mono focus:border-cyan-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Node Coordinates Summary */}
          <div className="bg-gray-800/60 p-2.5 rounded-xl border border-gray-700/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-green-400 ring-2 ring-green-400/30"></span>
              <span className="text-gray-400">Start:</span>
              <span className="font-mono font-bold text-green-400">{startPos}</span>
            </div>
            <div className="h-4 w-[1px] bg-gray-700"></div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400 ring-2 ring-red-400/30"></span>
              <span className="text-gray-400">Goal:</span>
              <span className="font-mono font-bold text-red-400">{goalPos}</span>
            </div>
            <div className="h-4 w-[1px] bg-gray-700"></div>
            <div className="text-gray-400">
              <span className="font-mono text-gray-300">{safeRows * safeCols}</span> tiles
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-medium text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 via-sky-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-lg hover:shadow-cyan-500/25 transition-all active:scale-95"
            >
              Apply Dimensions
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
