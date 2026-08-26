import { useState, useEffect, useMemo, useRef, type ReactNode } from 'react';
import { diffLines, diffWords, type Change } from 'diff';
import { useLocale } from '@/hooks/useLocale';

interface DiffViewProps {
  originalValue: string;
  modifiedValue: string;
  onOriginalChange: (value: string) => void;
  onModifiedChange: (value: string) => void;
  theme?: 'dark' | 'light';
  diffType?: 'lines' | 'words' | 'chars';
  ignoreWhitespace?: boolean;
}

/* ─── Colour tokens (GitHub-style) ───────────────────────────────────── */

const colours = {
  dark: {
    // Line-level background (soft)
    removedLineBg: 'rgba(248, 81, 73, 0.10)',
    addedLineBg: 'rgba(63, 185, 80, 0.10)',
    // Word-level highlight (strong) — only the changed word/char
    removedWordBg: 'rgba(248, 81, 73, 0.40)',
    addedWordBg: 'rgba(63, 185, 80, 0.40)',
    // Border
    removedBorder: 'rgba(248, 81, 73, 0.5)',
    addedBorder: 'rgba(63, 185, 80, 0.5)',
    // Text
    removedText: '#ffa7a7',
    addedText: '#7ee787',
    unchangedText: 'var(--text-primary)',
    lineNumColor: 'var(--text-tertiary)',
    gutterBorder: 'var(--border-subtle)',
    // Prefix (+ / -)
    prefixRemoved: '#f85149',
    prefixAdded: '#3fb950',
  },
  light: {
    removedLineBg: 'rgba(255, 129, 130, 0.12)',
    addedLineBg: 'rgba(46, 160, 67, 0.10)',
    removedWordBg: 'rgba(255, 129, 130, 0.45)',
    addedWordBg: 'rgba(46, 160, 67, 0.35)',
    removedBorder: 'rgba(255, 129, 130, 0.60)',
    addedBorder: 'rgba(46, 160, 67, 0.50)',
    removedText: '#82071e',
    addedText: '#116329',
    unchangedText: 'var(--text-primary)',
    lineNumColor: 'var(--text-tertiary)',
    gutterBorder: 'var(--border-subtle)',
    prefixRemoved: '#cf222e',
    prefixAdded: '#1a7f37',
  },
} as const;

type Palette = (typeof colours)[keyof typeof colours];

/* ─── Types ──────────────────────────────────────────────────────────── */

interface UnifiedRow {
  kind: 'unchanged' | 'removed' | 'added';
  leftNum: number | null;
  rightNum: number | null;
  /** Pre-rendered content with inline word highlights (ReactNode) */
  content: ReactNode;
  /** Plain text for the line (used for prefix display) */
  text: string;
}

/* ─── Helpers ────────────────────────────────────────────────────────── */

/** Split a Change value into individual lines (strips trailing newline) */
function splitLines(value: string): string[] {
  const raw = value.endsWith('\n') ? value.slice(0, -1) : value;
  return raw.split('\n');
}

/**
 * Given two arrays of lines (removed vs added), pair them 1-to-1 and
 * run word-level diff on each pair so only the specific changed
 * words/characters are highlighted, not the entire line.
 */
function buildInlineHighlightedRows(
  removedLines: string[],
  addedLines: string[],
  leftNumStart: number,
  rightNumStart: number,
  palette: Palette,
): UnifiedRow[] {
  const rows: UnifiedRow[] = [];
  const maxLen = Math.max(removedLines.length, addedLines.length);

  for (let i = 0; i < maxLen; i++) {
    const oldLine = i < removedLines.length ? removedLines[i] : null;
    const newLine = i < addedLines.length ? addedLines[i] : null;

    if (oldLine !== null && newLine !== null) {
      // Both exist → word-level diff within this line pair
      const wordChanges = diffWords(oldLine, newLine);

      // Build removed line content (unchanged words + removed words highlighted)
      const removedContent: ReactNode[] = [];
      const addedContent: ReactNode[] = [];

      wordChanges.forEach((part, idx) => {
        if (part.removed) {
          removedContent.push(
            <span
              key={idx}
              style={{
                backgroundColor: palette.removedWordBg,
                borderRadius: '2px',
                padding: '0 1px',
              }}
            >
              {part.value}
            </span>,
          );
        } else if (part.added) {
          addedContent.push(
            <span
              key={idx}
              style={{
                backgroundColor: palette.addedWordBg,
                borderRadius: '2px',
                padding: '0 1px',
              }}
            >
              {part.value}
            </span>,
          );
        } else {
          // Unchanged word — appears in both
          removedContent.push(<span key={`u-r-${idx}`}>{part.value}</span>);
          addedContent.push(<span key={`u-a-${idx}`}>{part.value}</span>);
        }
      });

      rows.push({
        kind: 'removed',
        leftNum: leftNumStart + i,
        rightNum: null,
        content: <>{removedContent}</>,
        text: oldLine,
      });
      rows.push({
        kind: 'added',
        leftNum: null,
        rightNum: rightNumStart + i,
        content: <>{addedContent}</>,
        text: newLine,
      });
    } else if (oldLine !== null) {
      // Pure removal — no matching added line, highlight entire content
      rows.push({
        kind: 'removed',
        leftNum: leftNumStart + i,
        rightNum: null,
        content: (
          <span
            style={{
              backgroundColor: palette.removedWordBg,
              borderRadius: '2px',
              padding: '0 1px',
            }}
          >
            {oldLine}
          </span>
        ),
        text: oldLine,
      });
    } else if (newLine !== null) {
      // Pure addition — no matching removed line
      rows.push({
        kind: 'added',
        leftNum: null,
        rightNum: rightNumStart + i,
        content: (
          <span
            style={{
              backgroundColor: palette.addedWordBg,
              borderRadius: '2px',
              padding: '0 1px',
            }}
          >
            {newLine}
          </span>
        ),
        text: newLine,
      });
    }
  }

  return rows;
}

/**
 * Build a unified list of rows from line-level diff changes,
 * with word-level inline highlighting for modified lines.
 */
function buildUnifiedRows(
  changes: Change[],
  palette: Palette,
): { rows: UnifiedRow[]; addedCount: number; removedCount: number } {
  const rows: UnifiedRow[] = [];
  let leftNum = 1;
  let rightNum = 1;
  let addedCount = 0;
  let removedCount = 0;

  // We need to look ahead to pair removed+added blocks
  let i = 0;
  while (i < changes.length) {
    const change = changes[i];

    if (!change.added && !change.removed) {
      // Unchanged block
      const lines = splitLines(change.value);
      for (const line of lines) {
        rows.push({
          kind: 'unchanged',
          leftNum: leftNum++,
          rightNum: rightNum++,
          content: <span>{line}</span>,
          text: line,
        });
      }
      i++;
    } else {
      // Collect consecutive removed and added blocks
      let removedLines: string[] = [];
      let addedLines: string[] = [];
      const removedStart = leftNum;
      const addedStart = rightNum;

      // Gather removed
      while (i < changes.length && changes[i].removed) {
        const lines = splitLines(changes[i].value);
        removedLines = removedLines.concat(lines);
        i++;
      }
      // Gather added (immediately after removed)
      while (i < changes.length && changes[i].added) {
        const lines = splitLines(changes[i].value);
        addedLines = addedLines.concat(lines);
        i++;
      }

      removedCount += removedLines.length;
      addedCount += addedLines.length;

      // Build rows with inline word-level highlights
      const inlineRows = buildInlineHighlightedRows(
        removedLines,
        addedLines,
        removedStart,
        addedStart,
        palette,
      );
      rows.push(...inlineRows);

      leftNum = removedStart + removedLines.length;
      rightNum = addedStart + addedLines.length;
    }
  }

  return { rows, addedCount, removedCount };
}

/* ─── Row component ──────────────────────────────────────────────────── */

function UnifiedDiffRow({
  row,
  palette,
}: {
  row: UnifiedRow;
  palette: Palette;
}) {
  const isRemoved = row.kind === 'removed';
  const isAdded = row.kind === 'added';

  let bgColor = 'transparent';
  let borderLeft = 'none';
  let prefixChar = ' ';
  let prefixColor = 'transparent';

  if (isRemoved) {
    bgColor = palette.removedLineBg;
    borderLeft = `3px solid ${palette.removedBorder}`;
    prefixChar = '−';
    prefixColor = palette.prefixRemoved;
  } else if (isAdded) {
    bgColor = palette.addedLineBg;
    borderLeft = `3px solid ${palette.addedBorder}`;
    prefixChar = '+';
    prefixColor = palette.prefixAdded;
  }

  const lineStyle: React.CSSProperties = {
    display: 'flex',
    minHeight: '1.5rem',
    lineHeight: '1.5rem',
    fontFamily: 'var(--font-mono)',
    fontSize: '0.8125rem',
    background: bgColor,
    borderLeft,
  };

  const gutterStyle: React.CSSProperties = {
    width: '3rem',
    minWidth: '3rem',
    textAlign: 'right',
    paddingRight: '0.375rem',
    color: palette.lineNumColor,
    userSelect: 'none',
    flexShrink: 0,
    fontSize: '0.75rem',
  };

  return (
    <div style={lineStyle}>
      {/* Left line number */}
      <span style={gutterStyle}>{row.leftNum ?? ''}</span>
      {/* Right line number */}
      <span style={{ ...gutterStyle, borderRight: `1px solid ${palette.gutterBorder}` }}>
        {row.rightNum ?? ''}
      </span>
      {/* Prefix (+/-/space) */}
      <span
        style={{
          width: '1.25rem',
          minWidth: '1.25rem',
          textAlign: 'center',
          color: prefixColor,
          fontWeight: 700,
          userSelect: 'none',
          flexShrink: 0,
        }}
      >
        {prefixChar}
      </span>
      {/* Content with inline highlights */}
      <span
        style={{
          flex: 1,
          paddingRight: '0.5rem',
          color: isRemoved
            ? palette.removedText
            : isAdded
              ? palette.addedText
              : palette.unchangedText,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-all',
        }}
      >
        {row.content}
      </span>
    </div>
  );
}

/* ─── Main DiffView ──────────────────────────────────────────────────── */

export default function DiffView({
  originalValue,
  modifiedValue,
  onOriginalChange,
  onModifiedChange,
  theme = 'dark',
  ignoreWhitespace = false,
}: DiffViewProps) {
  const { t } = useLocale();
  const palette = colours[theme];

  const [showDiff, setShowDiff] = useState(false);

  // Compute unified diff with inline word highlights
  const { rows, hasDiff, addedCount, removedCount } = useMemo(() => {
    if (!originalValue && !modifiedValue) {
      return { rows: [], hasDiff: false, addedCount: 0, removedCount: 0 };
    }

    const changes = diffLines(originalValue, modifiedValue, { ignoreWhitespace });
    const anyDiff = changes.some((c) => c.added || c.removed);

    if (!anyDiff) {
      return { rows: [], hasDiff: false, addedCount: 0, removedCount: 0 };
    }

    const result = buildUnifiedRows(changes, palette);
    return { rows: result.rows, hasDiff: true, addedCount: result.addedCount, removedCount: result.removedCount };
  }, [originalValue, modifiedValue, ignoreWhitespace, palette]);

  // Auto-show diff when both inputs have content
  useEffect(() => {
    setShowDiff(!!originalValue && !!modifiedValue);
  }, [originalValue, modifiedValue]);

  /* ── Scroll ref for diff panel ── */
  const diffRef = useRef<HTMLDivElement>(null);

  /* ── Render ── */
  return (
    <div className="flex flex-col h-full min-h-0 gap-3">
      {/* Editor row — always visible */}
      <div
        className="grid grid-cols-1 md:grid-cols-2 gap-3 min-h-[160px] max-md:auto-rows-[minmax(12rem,1fr)]"
        style={{ flex: showDiff && hasDiff ? '0 0 auto' : '1 1 0%' }}
      >
        {/* Original */}
        <div
          className="panel flex flex-col min-h-0"
          style={{ minHeight: showDiff && hasDiff ? '160px' : undefined }}
        >
          <div className="panel-header">
            <span>{t.original}</span>
            {showDiff && hasDiff && removedCount > 0 && (
              <span style={{ color: palette.removedText, fontSize: '0.6875rem', fontWeight: 500 }}>
                −{removedCount} {removedCount === 1 ? 'line' : 'lines'}
              </span>
            )}
          </div>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <textarea
              value={originalValue}
              onChange={(e) => onOriginalChange(e.target.value)}
              placeholder={t.pasteOriginal}
              spellCheck={false}
              style={{
                flex: 1,
                width: '100%',
                resize: 'none',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: 'none',
                outline: 'none',
                padding: '0.625rem 0.875rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                lineHeight: '1.5rem',
                minHeight: 0,
              }}
            />
          </div>
        </div>

        {/* Modified */}
        <div
          className="panel flex flex-col min-h-0"
          style={{ minHeight: showDiff && hasDiff ? '160px' : undefined }}
        >
          <div className="panel-header">
            <span>{t.modified}</span>
            {showDiff && hasDiff && addedCount > 0 && (
              <span style={{ color: palette.addedText, fontSize: '0.6875rem', fontWeight: 500 }}>
                +{addedCount} {addedCount === 1 ? 'line' : 'lines'}
              </span>
            )}
          </div>
          <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
            <textarea
              value={modifiedValue}
              onChange={(e) => onModifiedChange(e.target.value)}
              placeholder={t.pasteModified}
              spellCheck={false}
              style={{
                flex: 1,
                width: '100%',
                resize: 'none',
                background: 'var(--bg-input)',
                color: 'var(--text-primary)',
                border: 'none',
                outline: 'none',
                padding: '0.625rem 0.875rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8125rem',
                lineHeight: '1.5rem',
                minHeight: 0,
              }}
            />
          </div>
        </div>
      </div>

      {/* ── Unified diff with inline word highlights ── */}
      {showDiff && hasDiff && (
        <div className="panel flex flex-col flex-1 min-h-[200px]">
          <div className="panel-header">
            <span className="flex items-center gap-2">
              {t.diffResult}
              <span
                style={{
                  display: 'inline-flex',
                  gap: '0.5rem',
                  fontSize: '0.6875rem',
                  fontWeight: 500,
                  letterSpacing: 0,
                  textTransform: 'none',
                }}
              >
                {removedCount > 0 && (
                  <span style={{ color: palette.prefixRemoved }}>−{removedCount}</span>
                )}
                {addedCount > 0 && (
                  <span style={{ color: palette.prefixAdded }}>+{addedCount}</span>
                )}
              </span>
            </span>
          </div>

          {/* Unified diff rows */}
          <div
            ref={diffRef}
            className="flex-1 min-h-0"
            style={{ overflow: 'auto' }}
          >
            {rows.map((row, idx) => (
              <UnifiedDiffRow key={idx} row={row} palette={palette} />
            ))}
          </div>
        </div>
      )}

      {/* No differences message */}
      {showDiff && !hasDiff && originalValue && modifiedValue && (
        <div
          className="panel"
          style={{
            padding: '1rem',
            textAlign: 'center',
            color: 'var(--text-tertiary)',
            fontSize: '0.8125rem',
          }}
        >
          ✓ No differences found — texts are identical.
        </div>
      )}
    </div>
  );
}
