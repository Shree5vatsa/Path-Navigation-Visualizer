# PathAlgo-Navigator

Hey there! 👋 Welcome to PathAlgo-Navigator — a project I built to make learning pathfinding and maze algorithms fun, visual, and interactive. If you've ever wondered how algorithms like Dijkstra or A* actually work, or just want to play with mazes, you're in the right place!

---

What does it do?

This is a web app where you can:
- Watch popular pathfinding algorithms (Dijkstra, A*, BFS, DFS) solve a grid in real time.
- Generate cool mazes with a click (Binary Tree and Recursive Division styles).
- Play around: add or remove walls, drag the start/end points, and see how the algorithms react.
- Change animation speed to slow things down or speed them up.
- Get instant feedback with toasts and a handy legend so you always know what's happening.

It's all built with React, TypeScript, and Tailwind CSS, so it's fast and looks good on any device.

---

Getting Started

Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/Shree5vatsa/Path-Navigation-Visualizer
cd Path-Navigation-Visualizer
npm install
```

Running the App

For development, just run:
```bash
npm run dev
```

To see a production build preview:
```bash
npm run preview
```

Open your browser to the local address it gives you, and you're set!

---

Usage

Here's how you can have fun with it:

1. Pick a Maze: Choose a maze type and hit "Generate Maze" to fill the grid with obstacles.
2. Choose an Algorithm & Speed: Select which pathfinding algorithm you want to see, and how fast you want the animation.
3. Start the Show: Click "Start" and watch the algorithm do its thing!
4. Interact: Drag on the grid to add or remove walls, or move the start/end points to see how the path changes.
5. Reset: Use "Clear Path" to remove just the path, or "Clear Grid" to wipe everything and start fresh.

---

What's Inside?

Pathfinding Algorithms
- Dijkstra's Algorithm: Finds the shortest path, guaranteed.
- A* Search: Like Dijkstra, but a bit smarter with heuristics.
- Breadth First Search (BFS): Explores layer by layer.
- Depth First Search (DFS): Dives deep before backtracking.

Maze Generation
- Binary Tree: Simple, fast, and creates interesting patterns.
- Recursive Division: Splits the grid with walls and leaves random gaps for paths.

---

Want to Add Your Own Algorithm or Maze?

I made it easy to extend! If you want to add a new pathfinding algorithm:
- Drop your code in src/lib/algo/pathnavigating/ and register it in src/utils/constants.ts.

For new maze generators:
- Add your maze logic to src/lib/algo/maze/ and register it in src/utils/constants.ts.

If you do something cool, let me know — I'd love to see it!

---

Tech Stack
- Frontend: React + TypeScript
- Styling: Tailwind CSS
- Build Tool: Vite

---

About Me

Author: Shreevatsa Acharya  
Email: shreevatsa076@gmail.com, shreevatsa9124@gmail.com

If you have questions, ideas, or just want to chat about algorithms, feel free to reach out!

