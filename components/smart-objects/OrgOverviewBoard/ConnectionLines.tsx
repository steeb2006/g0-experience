"use client";

import { motion } from "framer-motion";

interface Position {
  x: number;
  y: number;
}

interface Connection {
  from: Position;
  to: Position;
  color: string;
  type: "org-ws" | "ws-board" | "board-subboard";
}

interface ConnectionLinesProps {
  connections: Connection[];
}

// Node sizes for edge calculations
const NODE_SIZES = {
  org: 40,        // radius of org node (80/2)
  workspace: 35,  // radius of workspace node (70/2)
  board: 35,      // approx half-width of board
  subboard: 28,   // approx half-width of subboard
};

// Calculate point on edge of source node towards target
function getEdgePoint(from: Position, to: Position, radius: number): Position {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.sqrt(dx * dx + dy * dy);
  if (distance === 0) return from;

  return {
    x: from.x + (dx / distance) * radius,
    y: from.y + (dy / distance) * radius,
  };
}

export function ConnectionLines({ connections }: ConnectionLinesProps) {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ overflow: "visible" }}
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {connections.map((connection, index) => {
        const { from, to, color, type } = connection;

        // Get source and target radii based on connection type
        let fromRadius: number;
        let toRadius: number;

        switch (type) {
          case "org-ws":
            fromRadius = NODE_SIZES.org;
            toRadius = NODE_SIZES.workspace;
            break;
          case "ws-board":
            fromRadius = NODE_SIZES.workspace;
            toRadius = NODE_SIZES.board;
            break;
          case "board-subboard":
            fromRadius = NODE_SIZES.board;
            toRadius = NODE_SIZES.subboard;
            break;
        }

        // Calculate edge points
        const startPoint = getEdgePoint(from, to, fromRadius);
        const endPoint = getEdgePoint(to, from, toRadius);

        // Line style based on type
        const getLineStyle = () => {
          switch (type) {
            case "org-ws":
              return { strokeWidth: 2, opacity: 0.6 };
            case "ws-board":
              return { strokeWidth: 1.5, opacity: 0.5 };
            case "board-subboard":
              return { strokeWidth: 1, opacity: 0.4 };
          }
        };

        const style = getLineStyle();

        return (
          <motion.line
            key={`${from.x}-${from.y}-${to.x}-${to.y}-${index}`}
            x1={startPoint.x}
            y1={startPoint.y}
            x2={endPoint.x}
            y2={endPoint.y}
            stroke={color}
            strokeWidth={style.strokeWidth}
            strokeOpacity={style.opacity}
            strokeLinecap="round"
            filter="url(#glow)"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: style.opacity }}
            transition={{
              delay: type === "org-ws" ? 0.05 : type === "ws-board" ? 0.2 : 0.35,
              duration: 0.5,
              ease: "easeOut",
            }}
          />
        );
      })}
    </svg>
  );
}
