"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { OrgNode } from "./OrgNode";
import { ConnectionLines } from "./ConnectionLines";
import type { OrgOverviewData } from "@/lib/mock-data/organization";

interface Position {
  x: number;
  y: number;
}

interface OrgRadialViewProps {
  data: OrgOverviewData;
  onWorkspaceClick?: (workspaceId: string) => void;
  onBoardClick?: (workspaceId: string, boardId: string) => void;
  onSubBoardClick?: (workspaceId: string, boardId: string) => void;
  className?: string;
}


// Fixed positions layout - manually positioned for clarity
function calculatePositions(data: OrgOverviewData) {
  const centerX = 600;
  const centerY = 390;

  const positions: {
    org: Position;
    workspaces: Array<{
      id: string;
      position: Position;
      color: string;
      boards: Array<{
        id: string;
        position: Position;
        subBoards: Array<{
          id: string;
          position: Position;
        }>;
      }>;
    }>;
  } = {
    org: { x: centerX, y: centerY },
    workspaces: [],
  };

  // Manual layout for each workspace to avoid overlap
  const layouts: Record<string, {
    ws: Position;
    boards: Array<{ pos: Position; subBoards: Position[] }>;
  }> = {
    // Finance - Top right
    ws_finance: {
      ws: { x: centerX + 180, y: centerY - 120 },
      boards: [{
        pos: { x: centerX + 320, y: centerY - 200 },
        subBoards: [
          { x: centerX + 420, y: centerY - 320 },  // Controlling
          { x: centerX + 500, y: centerY - 240 },  // Cash Flow
          { x: centerX + 520, y: centerY - 150 },  // HR Costs
          { x: centerX + 480, y: centerY - 60 },   // Forecast
        ],
      }],
    },
    // HR - Bottom right
    ws_hr: {
      ws: { x: centerX + 180, y: centerY + 120 },
      boards: [{
        pos: { x: centerX + 320, y: centerY + 200 },
        subBoards: [
          { x: centerX + 420, y: centerY + 100 },  // Recruiting
          { x: centerX + 500, y: centerY + 180 },  // Compensation
          { x: centerX + 520, y: centerY + 270 },  // Learning
          { x: centerX + 480, y: centerY + 350 },  // Offboarding
        ],
      }],
    },
    // Sales - Bottom left
    ws_sales: {
      ws: { x: centerX - 180, y: centerY + 120 },
      boards: [
        {
          pos: { x: centerX - 280, y: centerY + 220 },
          subBoards: [
            { x: centerX - 380, y: centerY + 140 },  // Planning
            { x: centerX - 430, y: centerY + 230 },  // Execution
            { x: centerX - 400, y: centerY + 320 },  // Analytics
          ],
        },
        {
          pos: { x: centerX - 350, y: centerY + 80 },
          subBoards: [
            { x: centerX - 480, y: centerY + 20 },   // Segments
            { x: centerX - 520, y: centerY + 100 },  // Health
            { x: centerX - 500, y: centerY - 60 },   // Expansion
          ],
        },
      ],
    },
    // Operations - Top left
    ws_operations: {
      ws: { x: centerX - 180, y: centerY - 120 },
      boards: [
        { pos: { x: centerX - 280, y: centerY - 200 }, subBoards: [] },
        { pos: { x: centerX - 350, y: centerY - 100 }, subBoards: [] },
      ],
    },
  };

  data.workspaces.forEach((workspace) => {
    const layout = layouts[workspace.id];
    if (!layout) return;

    const wsData = {
      id: workspace.id,
      position: layout.ws,
      color: workspace.color,
      boards: [] as Array<{
        id: string;
        position: Position;
        subBoards: Array<{ id: string; position: Position }>;
      }>,
    };

    workspace.boards.forEach((board, boardIndex) => {
      const boardLayout = layout.boards[boardIndex];
      if (!boardLayout) return;

      const boardData = {
        id: board.id,
        position: boardLayout.pos,
        subBoards: [] as Array<{ id: string; position: Position }>,
      };

      board.subBoards.forEach((subBoard, sbIndex) => {
        const sbPos = boardLayout.subBoards[sbIndex];
        if (sbPos) {
          boardData.subBoards.push({
            id: subBoard.id,
            position: sbPos,
          });
        }
      });

      wsData.boards.push(boardData);
    });

    positions.workspaces.push(wsData);
  });

  return positions;
}

export function OrgRadialView({
  data,
  onWorkspaceClick,
  onBoardClick,
  onSubBoardClick,
  className,
}: OrgRadialViewProps) {
  const positions = calculatePositions(data);

  const allConnections: Array<{
    from: Position;
    to: Position;
    color: string;
    type: "org-ws" | "ws-board" | "board-subboard";
  }> = [];

  positions.workspaces.forEach((ws) => {
    allConnections.push({
      from: positions.org,
      to: ws.position,
      color: ws.color,
      type: "org-ws",
    });

    ws.boards.forEach((board) => {
      allConnections.push({
        from: ws.position,
        to: board.position,
        color: ws.color,
        type: "ws-board",
      });

      board.subBoards.forEach((sb) => {
        allConnections.push({
          from: board.position,
          to: sb.position,
          color: ws.color,
          type: "board-subboard",
        });
      });
    });
  });

  return (
    <motion.div
      className={cn("relative rounded-2xl overflow-hidden", className)}
      style={{
        width: 1200,
        height: 850,
        background: "linear-gradient(180deg, #080808 0%, #000000 100%)",
        border: "1px solid #1a1a1a",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div
        className="absolute top-0 left-0 right-0 h-12 px-6 flex items-center justify-between z-20"
        style={{ borderBottom: "1px solid #1a1a1a" }}
      >
        <div className="flex items-center gap-4">
          <h1 className="text-sm font-semibold text-white">Organization Overview</h1>
          <span className="text-xs text-gray-500 px-2 py-0.5 rounded" style={{ background: "#111" }}>
            {data.org.name}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-xs text-gray-500">Live</span>
        </div>
      </div>

      {/* Radial View */}
      <div className="absolute top-12 bottom-12 left-0 right-0">
        <ConnectionLines connections={allConnections} />

        <OrgNode
          type="org"
          data={{ id: data.org.id, name: data.org.name }}
          position={positions.org}
        />

        {data.workspaces.map((workspace, wsIndex) => {
          const wsPosition = positions.workspaces[wsIndex];
          if (!wsPosition) return null;

          return (
            <div key={workspace.id}>
              <OrgNode
                type="workspace"
                data={{
                  id: workspace.id,
                  name: workspace.name,
                  color: workspace.color,
                  entity: workspace.entity,
                }}
                position={wsPosition.position}
                onClick={() => onWorkspaceClick?.(workspace.id)}
              />

              {workspace.boards.map((board, boardIndex) => {
                const boardPosition = wsPosition.boards[boardIndex];
                if (!boardPosition) return null;

                return (
                  <div key={board.id}>
                    <OrgNode
                      type="board"
                      data={{
                        id: board.id,
                        name: board.name,
                        icon: board.icon,
                        color: workspace.color,
                      }}
                      position={boardPosition.position}
                      onClick={() => onBoardClick?.(workspace.id, board.id)}
                    />

                    {board.subBoards.map((subBoard, sbIndex) => {
                      const sbPosition = boardPosition.subBoards[sbIndex];
                      if (!sbPosition) return null;

                      return (
                        <OrgNode
                          key={subBoard.id}
                          type="subboard"
                          data={{
                            id: subBoard.id,
                            name: subBoard.name,
                            icon: subBoard.icon,
                            color: workspace.color,
                          }}
                          position={sbPosition.position}
                          onClick={() => onSubBoardClick?.(workspace.id, subBoard.id)}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div
        className="absolute bottom-0 left-0 right-0 h-12 px-6 flex items-center justify-center gap-10 z-20"
        style={{ borderTop: "1px solid #1a1a1a" }}
      >
        {data.workspaces.map((ws) => (
          <div key={ws.id} className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ws.color }} />
            <span className="text-sm text-gray-300 font-medium">{ws.name}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
