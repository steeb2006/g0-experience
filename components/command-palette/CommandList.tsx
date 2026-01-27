"use client";

import { cn } from "@/lib/utils";
import { Text } from "@/components/smart-objects/atomics";
import { CommandItem } from "./CommandItem";
import type { Command } from "@/lib/stores/command-palette";

interface CommandListProps {
  commands: Command[];
  selectedIndex: number;
  onSelect: (command: Command) => void;
  className?: string;
}

export function CommandList({
  commands,
  selectedIndex,
  onSelect,
  className,
}: CommandListProps) {
  // Group commands by category
  const grouped = commands.reduce(
    (acc, command) => {
      const category = command.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(command);
      return acc;
    },
    {} as Record<string, Command[]>
  );

  const categoryLabels: Record<string, string> = {
    boards: "BOARDS",
    actions: "ACTIONS",
    entity: "ENTITY",
  };

  const categoryOrder = ["boards", "actions", "entity"];

  // Calculate flat index for selection
  let flatIndex = 0;

  if (commands.length === 0) {
    return (
      <div className={cn("p-8 text-center", className)}>
        <Text variant="body" color="muted">
          No results found
        </Text>
      </div>
    );
  }

  return (
    <div className={cn("max-h-[400px] overflow-y-auto py-2", className)}>
      {categoryOrder.map((category) => {
        const categoryCommands = grouped[category];
        if (!categoryCommands || categoryCommands.length === 0) return null;

        return (
          <div key={category} className="mb-2">
            <Text
              variant="small"
              color="muted"
              className="mb-1 px-3 uppercase tracking-wider"
            >
              {categoryLabels[category] || category}
            </Text>
            <div>
              {categoryCommands.map((command) => {
                const currentIndex = flatIndex;
                flatIndex++;
                return (
                  <CommandItem
                    key={command.id}
                    command={command}
                    isSelected={currentIndex === selectedIndex}
                    onClick={() => onSelect(command)}
                  />
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
