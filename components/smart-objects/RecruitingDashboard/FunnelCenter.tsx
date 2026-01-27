"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { RecruitingPipelineStage } from "@/lib/mock-data/recruiting-dashboard";

interface FunnelCenterProps {
  stages: RecruitingPipelineStage[];
  size?: number;
  className?: string;
}

export function FunnelCenter({ stages, size = 200, className }: FunnelCenterProps) {
  const totalHeight = size;
  const maxWidth = size * 0.9;
  const minWidth = size * 0.3;

  // Calculate widths for each stage (funnel effect)
  const stageHeights = stages.map((_, i) => {
    const heightRatio = 1 / stages.length;
    return totalHeight * heightRatio;
  });

  const getStageWidth = (index: number) => {
    const ratio = 1 - index / (stages.length - 1);
    return minWidth + (maxWidth - minWidth) * ratio;
  };

  let cumulativeY = 0;

  return (
    <div className={cn("relative", className)} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="overflow-visible"
      >
        {/* Background glow */}
        <defs>
          {stages.map((stage) => (
            <linearGradient
              key={`grad-${stage.id}`}
              id={`gradient-${stage.id}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={stage.color} stopOpacity={0.8} />
              <stop offset="100%" stopColor={stage.color} stopOpacity={0.4} />
            </linearGradient>
          ))}
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Funnel stages */}
        {stages.map((stage, index) => {
          const topWidth = getStageWidth(index);
          const bottomWidth = getStageWidth(index + 1);
          const height = stageHeights[index];
          const y = cumulativeY;
          cumulativeY += height;

          const centerX = size / 2;
          const topLeft = centerX - topWidth / 2;
          const topRight = centerX + topWidth / 2;
          const bottomLeft = centerX - bottomWidth / 2;
          const bottomRight = centerX + bottomWidth / 2;

          const path = `
            M ${topLeft} ${y}
            L ${topRight} ${y}
            L ${bottomRight} ${y + height}
            L ${bottomLeft} ${y + height}
            Z
          `;

          return (
            <motion.g key={stage.id}>
              {/* Stage shape */}
              <motion.path
                d={path}
                fill={`url(#gradient-${stage.id})`}
                stroke={stage.color}
                strokeWidth={1}
                filter="url(#glow)"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              />

              {/* Stage count */}
              <motion.text
                x={centerX}
                y={y + height / 2 + 4}
                textAnchor="middle"
                fill="white"
                fontSize={height > 30 ? 14 : 10}
                fontWeight="600"
                className="tabular-nums"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 + 0.2, duration: 0.3 }}
              >
                {stage.count}
              </motion.text>
            </motion.g>
          );
        })}
      </svg>

      {/* Animated particles flowing down */}
      {[0, 1, 2].map((particleIndex) => (
        <motion.div
          key={particleIndex}
          className="absolute rounded-full bg-white/40"
          style={{
            width: 4,
            height: 4,
            left: "50%",
            transform: "translateX(-50%)",
          }}
          initial={{ top: 0, opacity: 0 }}
          animate={{
            top: [0, size],
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            duration: 3,
            delay: particleIndex * 1,
            repeat: Infinity,
            ease: "easeIn",
          }}
        />
      ))}
    </div>
  );
}
