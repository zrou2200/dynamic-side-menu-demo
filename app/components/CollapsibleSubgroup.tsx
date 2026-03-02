'use client';

import { useRef, useState, useEffect } from 'react';
import { SubmenuGroup } from '../../lib/types';

const DEFAULT_MAX_VISIBLE = 6;

export default function CollapsibleSubgroup({ group }: { group: SubmenuGroup }) {
  const maxVisible = Math.min(group.maxVisible ?? DEFAULT_MAX_VISIBLE, DEFAULT_MAX_VISIBLE);
  const [expanded, setExpanded] = useState(false);
  const hasMore = group.lines.length > maxVisible;
  const linesRef = useRef<HTMLDivElement>(null);
  const [collapsedHeight, setCollapsedHeight] = useState<number>(0);
  const [fullHeight, setFullHeight] = useState<number>(0);

  useEffect(() => {
    if (!linesRef.current) return;
    const el = linesRef.current;
    // Remove constraint to measure
    const prev = el.style.maxHeight;
    el.style.maxHeight = 'none';
    el.style.transition = 'none';
    setFullHeight(el.scrollHeight);

    // Measure collapsed height from first maxVisible children
    const children = el.children;
    let h = 0;
    for (let i = 0; i < Math.min(children.length, maxVisible); i++) {
      const child = children[i] as HTMLElement;
      const style = getComputedStyle(child);
      h += child.offsetHeight
        + parseFloat(style.marginTop)
        + parseFloat(style.marginBottom);
    }
    setCollapsedHeight(h);

    // Restore
    el.style.maxHeight = prev;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    el.offsetHeight; // force reflow
    el.style.transition = '';
  }, [group.lines.length, maxVisible]);

  return (
    <div className="menu-subgroup">
      <div className="menu-subgroup-title">{group.title}</div>
      {/* Animated lines container */}
      <div
        ref={linesRef}
        style={{
          maxHeight: hasMore
            ? expanded
              ? fullHeight
              : collapsedHeight
            : undefined,
          overflow: 'hidden',
          transition: 'max-height 0.35s ease',
        }}
      >
        {group.lines.map((line, i) => (
          <div key={i} className="menu-sub-line">{line}</div>
        ))}
      </div>
      {/* Toggle button sits outside the clipped area */}
      {hasMore && (
        <div
          onClick={() => setExpanded(!expanded)}
          style={{
            fontSize: 10,
            color: '#1677ff',
            cursor: 'pointer',
            marginTop: 4,
            userSelect: 'none',
          }}
        >
          {expanded
            ? '▲ Show less'
            : `▼ Show all (${group.lines.length})`}
        </div>
      )}
    </div>
  );
}
