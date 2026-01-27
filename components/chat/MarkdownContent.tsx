"use client";

import { cn } from "@/lib/utils";

interface MarkdownContentProps {
  content: string;
  className?: string;
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
  // Parse markdown and render as React elements
  const renderContent = () => {
    const lines = content.split("\n");
    const elements: React.ReactNode[] = [];
    let inList = false;
    let listItems: React.ReactNode[] = [];
    let listType: "ul" | "ol" = "ul";
    let currentKey = 0;

    const flushList = () => {
      if (listItems.length > 0) {
        if (listType === "ul") {
          elements.push(
            <ul key={currentKey++} className="list-disc list-inside space-y-1 my-2 ml-1">
              {listItems}
            </ul>
          );
        } else {
          elements.push(
            <ol key={currentKey++} className="list-decimal list-inside space-y-1 my-2 ml-1">
              {listItems}
            </ol>
          );
        }
        listItems = [];
        inList = false;
      }
    };

    const parseInlineMarkdown = (text: string): React.ReactNode => {
      // Handle inline formatting: **bold**, *italic*, `code`
      const parts: React.ReactNode[] = [];
      let remaining = text;
      let partKey = 0;

      while (remaining.length > 0) {
        // Bold: **text**
        const boldMatch = remaining.match(/^\*\*(.+?)\*\*/);
        if (boldMatch) {
          parts.push(<strong key={partKey++} className="font-semibold text-[var(--g0-text-primary)]">{boldMatch[1]}</strong>);
          remaining = remaining.slice(boldMatch[0].length);
          continue;
        }

        // Italic: *text*
        const italicMatch = remaining.match(/^\*(.+?)\*/);
        if (italicMatch) {
          parts.push(<em key={partKey++} className="italic">{italicMatch[1]}</em>);
          remaining = remaining.slice(italicMatch[0].length);
          continue;
        }

        // Inline code: `code`
        const codeMatch = remaining.match(/^`(.+?)`/);
        if (codeMatch) {
          parts.push(
            <code key={partKey++} className="px-1.5 py-0.5 rounded bg-[var(--g0-bg-elevated-2)] text-[var(--g0-accent-cyan)] text-[12px] font-mono">
              {codeMatch[1]}
            </code>
          );
          remaining = remaining.slice(codeMatch[0].length);
          continue;
        }

        // Find next special character
        const nextSpecial = remaining.search(/[\*`]/);
        if (nextSpecial === -1) {
          parts.push(remaining);
          break;
        } else if (nextSpecial === 0) {
          // No match found, consume one character
          parts.push(remaining[0]);
          remaining = remaining.slice(1);
        } else {
          parts.push(remaining.slice(0, nextSpecial));
          remaining = remaining.slice(nextSpecial);
        }
      }

      return parts.length === 1 ? parts[0] : parts;
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Empty line
      if (line.trim() === "") {
        flushList();
        elements.push(<div key={currentKey++} className="h-2" />);
        continue;
      }

      // Headers
      const h3Match = line.match(/^### (.+)/);
      if (h3Match) {
        flushList();
        elements.push(
          <h3 key={currentKey++} className="text-[13px] font-semibold text-[var(--g0-text-primary)] mt-3 mb-1">
            {parseInlineMarkdown(h3Match[1])}
          </h3>
        );
        continue;
      }

      const h2Match = line.match(/^## (.+)/);
      if (h2Match) {
        flushList();
        elements.push(
          <h2 key={currentKey++} className="text-[14px] font-semibold text-[var(--g0-text-primary)] mt-3 mb-1">
            {parseInlineMarkdown(h2Match[1])}
          </h2>
        );
        continue;
      }

      // Bullet list: - item or • item
      const bulletMatch = line.match(/^[\-\•]\s+(.+)/);
      if (bulletMatch) {
        if (!inList || listType !== "ul") {
          flushList();
          inList = true;
          listType = "ul";
        }
        listItems.push(
          <li key={currentKey++} className="text-[var(--g0-text-secondary)]">
            {parseInlineMarkdown(bulletMatch[1])}
          </li>
        );
        continue;
      }

      // Numbered list: 1. item
      const numberedMatch = line.match(/^\d+\.\s+(.+)/);
      if (numberedMatch) {
        if (!inList || listType !== "ol") {
          flushList();
          inList = true;
          listType = "ol";
        }
        listItems.push(
          <li key={currentKey++} className="text-[var(--g0-text-secondary)]">
            {parseInlineMarkdown(numberedMatch[1])}
          </li>
        );
        continue;
      }

      // Table row: | col1 | col2 |
      const tableMatch = line.match(/^\|(.+)\|$/);
      if (tableMatch) {
        flushList();
        const cells = tableMatch[1].split("|").map(c => c.trim());
        const isHeader = lines[i + 1]?.match(/^\|[\-\s\|]+\|$/);

        if (isHeader) {
          // This is a header row
          elements.push(
            <div key={currentKey++} className="overflow-x-auto my-2">
              <table className="w-full text-[12px]">
                <thead>
                  <tr className="border-b border-[var(--g0-bg-elevated-3)]">
                    {cells.map((cell, idx) => (
                      <th key={idx} className="text-left py-1.5 px-2 font-semibold text-[var(--g0-text-primary)]">
                        {parseInlineMarkdown(cell)}
                      </th>
                    ))}
                  </tr>
                </thead>
              </table>
            </div>
          );
        } else if (!line.match(/^\|[\-\s\|]+\|$/)) {
          // This is a data row (not a separator)
          // Check if we already have a table started
          const lastElement = elements[elements.length - 1];
          if (lastElement && typeof lastElement === 'object' && 'props' in lastElement) {
            // Add to existing table - but for simplicity, just render as a row
            elements.push(
              <div key={currentKey++} className="overflow-x-auto">
                <table className="w-full text-[12px]">
                  <tbody>
                    <tr className="border-b border-[var(--g0-bg-elevated-3)]/50">
                      {cells.map((cell, idx) => (
                        <td key={idx} className="py-1.5 px-2 text-[var(--g0-text-secondary)]">
                          {parseInlineMarkdown(cell)}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }
        }
        continue;
      }

      // Regular paragraph
      flushList();
      elements.push(
        <p key={currentKey++} className="text-[var(--g0-text-secondary)]">
          {parseInlineMarkdown(line)}
        </p>
      );
    }

    flushList();
    return elements;
  };

  return (
    <div className={cn("text-[13px] leading-relaxed space-y-0.5", className)}>
      {renderContent()}
    </div>
  );
}
