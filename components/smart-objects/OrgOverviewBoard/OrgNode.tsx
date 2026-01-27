"use client";

import { motion } from "framer-motion";
import {
  LayoutDashboard,
  PieChart,
  Banknote,
  Users,
  TrendingUp,
  UserPlus,
  Coins,
  GraduationCap,
  UserMinus,
  Rocket,
  Calendar,
  Play,
  BarChart3,
  Building2,
  Heart,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import type { Entity } from "@/lib/mock-data/organization";

interface Position {
  x: number;
  y: number;
}

interface OrgNodeProps {
  type: "org" | "workspace" | "board" | "subboard";
  data: {
    id: string;
    name: string;
    icon?: string;
    color?: string;
    entity?: Entity;
  };
  position: Position;
  onClick?: () => void;
  isAvailable?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  PieChart,
  Banknote,
  Users,
  TrendingUp,
  UserPlus,
  Coins,
  GraduationCap,
  UserMinus,
  Rocket,
  Calendar,
  Play,
  BarChart3,
  Building2,
  Heart,
  Workflow,
};

function hexToRgba(hex: string, alpha: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  const R = num >> 16;
  const G = (num >> 8) & 0x00ff;
  const B = num & 0x0000ff;
  return `rgba(${R}, ${G}, ${B}, ${alpha})`;
}

export function OrgNode({
  type,
  data,
  position,
  onClick,
}: OrgNodeProps) {
  const Icon = data.icon ? iconMap[data.icon] : null;
  const color = data.color || "#6b7280";

  const renderContent = () => {
    switch (type) {
      case "org":
        return (
          <motion.div
            className="flex items-center justify-center rounded-full bg-white"
            style={{
              width: 80,
              height: 80,
              boxShadow: "0 0 50px rgba(255,255,255,0.5)",
            }}
            whileHover={{ scale: 1.05 }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
          >
            <span className="text-black text-2xl font-bold">{data.name}</span>
          </motion.div>
        );

      case "workspace":
        const wsWords = data.name.split(" ");
        return (
          <motion.button
            className="flex flex-col items-center justify-center rounded-full cursor-pointer"
            style={{
              width: 70,
              height: 70,
              border: `2px solid ${color}`,
              background: hexToRgba(color, 0.25),
              boxShadow: `0 0 25px ${hexToRgba(color, 0.5)}`,
            }}
            onClick={onClick}
            whileHover={{ scale: 1.1, boxShadow: `0 0 40px ${hexToRgba(color, 0.7)}` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: "spring" }}
          >
            <Users className="w-5 h-5 mb-0.5" style={{ color }} />
            <span className="text-[10px] font-semibold leading-tight text-center" style={{ color }}>
              {wsWords.length > 1 ? wsWords.map((w, i) => <span key={i} className="block">{w}</span>) : data.name}
            </span>
          </motion.button>
        );

      case "board":
        const boardWords = data.name.split(" ");
        return (
          <motion.button
            className="flex flex-col items-center justify-center rounded-lg cursor-pointer px-2 py-1.5"
            style={{
              minWidth: 70,
              minHeight: 55,
              background: color,
              boxShadow: `0 3px 20px ${hexToRgba(color, 0.6)}`,
            }}
            onClick={onClick}
            whileHover={{ scale: 1.1, boxShadow: `0 4px 30px ${hexToRgba(color, 0.8)}` }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.25, type: "spring" }}
          >
            {Icon && <Icon className="w-4 h-4 text-white mb-0.5" />}
            <span className="text-[9px] font-semibold text-white text-center leading-tight">
              {boardWords.length > 1 ? boardWords.map((w, i) => <span key={i} className="block">{w}</span>) : data.name}
            </span>
          </motion.button>
        );

      case "subboard":
        const subWords = data.name.split(" ");
        return (
          <motion.button
            className="flex flex-col items-center justify-center rounded-md cursor-pointer px-1.5 py-1"
            style={{
              minWidth: 55,
              minHeight: 45,
              background: hexToRgba(color, 0.35),
              border: `1px solid ${hexToRgba(color, 0.6)}`,
            }}
            onClick={onClick}
            whileHover={{ scale: 1.1, background: hexToRgba(color, 0.5) }}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.35, type: "spring" }}
          >
            {Icon && <Icon className="w-3 h-3 mb-0.5" style={{ color }} />}
            <span className="text-[8px] font-semibold text-center leading-tight" style={{ color }}>
              {subWords.length > 1 ? subWords.map((w, i) => <span key={i} className="block">{w}</span>) : data.name}
            </span>
          </motion.button>
        );
    }
  };

  return (
    <div
      className="absolute z-10"
      style={{
        left: position.x,
        top: position.y,
        transform: "translate(-50%, -50%)",
      }}
    >
      {renderContent()}
    </div>
  );
}
