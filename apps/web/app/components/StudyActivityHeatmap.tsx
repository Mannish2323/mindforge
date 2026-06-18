'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';

/* ─────────────────────────────────────────────────────────────
   TYPES
───────────────────────────────────────────────────────────── */
interface DayCell {
  date: Date;
  dateStr: string;
  label: string;        // "Jun 17"
  sessions: number;     // 0-5
  xp: number;
  col: number;          // 0-13
  row: number;          // 0-6
}

interface TooltipState {
  visible: boolean;
  x: number;
  y: number;
  cell: DayCell | null;
}

interface StudyActivityHeatmapProps {
  /** Map of dateStr (YYYY-MM-DD) → { sessions, xp }. If null, generates mock data unless realDataOnly=true. */
  activityData?: Record<string, { sessions: number; xp: number }> | null;
  /** When true: never generate fake data — show real zeros for new users */
  realDataOnly?: boolean;
}

/* ─────────────────────────────────────────────────────────────
   HELPERS
───────────────────────────────────────────────────────────── */
function toKey(d: Date) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function buildCells(
  activityData: Record<string, { sessions: number; xp: number }> | null,
  realDataOnly = false
): DayCell[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const startDay = new Date(today);
  startDay.setDate(today.getDate() - 97);
  const cells: DayCell[] = [];
  for (let i = 0; i < 98; i++) {
    const d = new Date(startDay);
    d.setDate(startDay.getDate() + i);
    const key = toKey(d);
    const info = activityData?.[key] ?? null;
    // Only use random mock data if NOT realDataOnly
    const sessions = info
      ? info.sessions
      : realDataOnly ? 0 : (Math.random() > 0.62 ? Math.ceil(Math.random() * 4) : 0);
    const xp = info ? info.xp : (realDataOnly ? 0 : sessions * (Math.floor(Math.random() * 15) + 5));
    cells.push({
      date: d, dateStr: key,
      label: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      sessions, xp,
      col: Math.floor(i / 7),
      row: i % 7,
    });
  }
  return cells;
}

function getColor(sessions: number): { bg: string; border: string; glow: string } {
  if (sessions === 0) return { bg: 'var(--surface-3)', border: 'transparent', glow: 'none' };
  const intensity = Math.min(sessions, 4);
  const configs = [
    { bg: 'rgba(22,163,74,0.22)', border: 'rgba(22,163,74,0.20)', glow: '0 0 0px transparent' },
    { bg: 'rgba(22,163,74,0.42)', border: 'rgba(22,163,74,0.35)', glow: '0 0 6px rgba(22,163,74,0.25)' },
    { bg: 'rgba(22,163,74,0.62)', border: 'rgba(22,163,74,0.50)', glow: '0 0 10px rgba(22,163,74,0.35)' },
    { bg: 'rgba(22,163,74,0.82)', border: 'rgba(22,163,74,0.70)', glow: '0 0 14px rgba(22,163,74,0.50)' },
    { bg: 'rgba(22,163,74,1.00)', border: 'rgba(22,163,74,0.90)', glow: '0 0 18px rgba(22,163,74,0.65)' },
  ];
  return configs[intensity];
}

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ─────────────────────────────────────────────────────────────
   CELL (memoised)
───────────────────────────────────────────────────────────── */
const HeatCell = React.memo(function HeatCell({
  cell, visible, delay, onHover, onLeave,
}: {
  cell: DayCell;
  visible: boolean;
  delay: number;
  onHover: (cell: DayCell, el: HTMLElement) => void;
  onLeave: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { bg, border, glow } = getColor(cell.sessions);
  const isToday = toKey(new Date()) === cell.dateStr;

  return (
    <div
      ref={ref}
      onMouseEnter={() => ref.current && onHover(cell, ref.current)}
      onMouseLeave={onLeave}
      style={{
        width: '13px',
        height: '13px',
        borderRadius: '3px',
        background: bg,
        border: isToday ? '2px solid var(--primary)' : `1px solid ${border}`,
        boxShadow: cell.sessions > 0 ? glow : 'none',
        cursor: cell.sessions > 0 ? 'pointer' : 'default',
        opacity: visible ? 1 : 0,
        transform: visible ? 'scale(1)' : 'scale(0.3)',
        transition: `opacity 0.35s ease ${delay}ms, transform 0.35s cubic-bezier(0.34,1.56,0.64,1) ${delay}ms, box-shadow 0.2s ease, border-color 0.2s ease`,
        position: 'relative',
      }}
      className="heat-cell"
    />
  );
});

/* ─────────────────────────────────────────────────────────────
   MONTH LABELS
───────────────────────────────────────────────────────────── */
function buildMonthLabels(cells: DayCell[]) {
  const labels: { col: number; text: string }[] = [];
  let lastMonth = -1;
  for (let col = 0; col < 14; col++) {
    const cell = cells[col * 7];
    if (!cell) continue;
    const m = cell.date.getMonth();
    if (m !== lastMonth) {
      labels.push({ col, text: cell.date.toLocaleDateString('en-IN', { month: 'short' }) });
      lastMonth = m;
    }
  }
  return labels;
}

/* ─────────────────────────────────────────────────────────────
   STATS SUMMARY
───────────────────────────────────────────────────────────── */
function buildStats(cells: DayCell[]) {
  const active = cells.filter(c => c.sessions > 0).length;
  const totalXP = cells.reduce((s, c) => s + c.xp, 0);

  let best = 0, cur = 0;
  for (const c of cells) {
    if (c.sessions > 0) { cur++; best = Math.max(best, cur); }
    else cur = 0;
  }

  // This week
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const weekStart = new Date(today); weekStart.setDate(today.getDate() - today.getDay());
  const weekXP = cells.filter(c => c.date >= weekStart).reduce((s, c) => s + c.xp, 0);

  return { active, totalXP, best, weekXP };
}

/* ─────────────────────────────────────────────────────────────
   TOOLTIP
───────────────────────────────────────────────────────────── */
function Tooltip({ state }: { state: TooltipState }) {
  if (!state.visible || !state.cell) return null;
  const c = state.cell;
  const { bg } = getColor(c.sessions);

  return (
    <div style={{
      position: 'fixed',
      left: state.x,
      top: state.y,
      zIndex: 9999,
      pointerEvents: 'none',
      transform: 'translate(-50%, -100%) translateY(-10px)',
      animation: 'tooltip-in 0.18s cubic-bezier(0.34,1.56,0.64,1) both',
    }}>
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '8px 12px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        minWidth: '130px',
        textAlign: 'center',
        backdropFilter: 'blur(12px)',
      }}>
        <div style={{ fontSize: '11px', color: 'var(--text-3)', marginBottom: '4px' }}>{c.label}</div>
        {c.sessions > 0 ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginBottom: '2px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '2px', background: bg }} />
              <span style={{ fontWeight: 800, fontSize: '14px', color: 'var(--text)' }}>
                {c.sessions} {c.sessions === 1 ? 'session' : 'sessions'}
              </span>
            </div>
            <div style={{ fontSize: '11px', color: 'var(--primary)', fontWeight: 700 }}>+{c.xp} XP earned</div>
          </>
        ) : (
          <div style={{ fontSize: '12px', color: 'var(--text-3)' }}>No activity</div>
        )}
        {/* Arrow */}
        <div style={{
          position: 'absolute', bottom: '-5px', left: '50%',
          width: '10px', height: '10px',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderTop: 'none', borderLeft: 'none',
          transform: 'translateX(-50%) rotate(45deg)',
        }} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   ANIMATED STAT NUMBER
───────────────────────────────────────────────────────────── */
function StatNum({ value, suffix = '' }: { value: number; suffix?: string }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const duration = 800;
    const step = 16;
    const inc = value / (duration / step);
    const timer = setInterval(() => {
      start = Math.min(start + inc, value);
      setDisplay(Math.round(start));
      if (start >= value) clearInterval(timer);
    }, step);
    return () => clearInterval(timer);
  }, [value]);
  return <>{display.toLocaleString()}{suffix}</>;
}

/* ─────────────────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────────────────── */
export function StudyActivityHeatmap({ activityData = null, realDataOnly = false }: StudyActivityHeatmapProps) {
  const [cells] = useState<DayCell[]>(() => buildCells(activityData, realDataOnly));
  const [visible, setVisible] = useState(false);
  const [tooltip, setTooltip] = useState<TooltipState>({ visible: false, x: 0, y: 0, cell: null });
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Intersection observer — animate when scrolled into view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.2 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const handleHover = useCallback((cell: DayCell, el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    setTooltip({ visible: true, x: rect.left + rect.width / 2, y: rect.top, cell });
    setHoveredCell(cell.dateStr);
  }, []);

  const handleLeave = useCallback(() => {
    setTooltip(t => ({ ...t, visible: false }));
    setHoveredCell(null);
  }, []);

  const monthLabels = buildMonthLabels(cells);
  const stats = buildStats(cells);
  const isAllEmpty = realDataOnly && cells.every(c => c.sessions === 0);

  // Group cells into columns (each column = 7 days)
  const columns: DayCell[][] = Array.from({ length: 14 }, (_, col) =>
    cells.filter(c => c.col === col)
  );

  return (
    <>
      <style>{`
        @keyframes tooltip-in {
          from { opacity: 0; transform: translate(-50%, -100%) translateY(-4px) scale(0.88); }
          to   { opacity: 1; transform: translate(-50%, -100%) translateY(-10px) scale(1); }
        }
        .heat-cell:hover {
          transform: scale(1.5) !important;
          z-index: 10;
          position: relative;
          border-radius: 4px !important;
        }
        .heat-stat-card {
          transition: transform 0.22s cubic-bezier(0.34,1.56,0.64,1), background 0.2s ease;
        }
        .heat-stat-card:hover {
          transform: translateY(-3px);
        }
      `}</style>

      <Tooltip state={tooltip} />

      <div ref={containerRef} style={{ padding: 'var(--sp-5)' }}>

        {/* ── Header ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 'var(--sp-4)' }}>
          <div>
            <h3 style={{ fontWeight: 900, fontSize: '16px', marginBottom: '2px' }}>📅 Study Activity</h3>
            <p style={{ fontSize: '11px', color: 'var(--text-3)' }}>14 weeks · every cell = one day</p>
          </div>
          {!isAllEmpty && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>Less</span>
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} style={{
                  width: '11px', height: '11px', borderRadius: '2px',
                  background: getColor(i).bg,
                  border: `1px solid ${getColor(i).border}`,
                  transition: 'transform 0.2s ease',
                }} />
              ))}
              <span style={{ fontSize: '10px', color: 'var(--text-3)' }}>More</span>
            </div>
          )}
        </div>

        {/* ── New-user empty state ── */}
        {isAllEmpty ? (
          <div style={{
            textAlign: 'center', padding: 'var(--sp-6) var(--sp-4)',
            background: 'var(--surface-2)', borderRadius: 'var(--radius-lg)',
            border: '1px dashed var(--border)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'scale(1)' : 'scale(0.95)',
            transition: 'all 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s',
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px', lineHeight: 1 }}>🌱</div>
            <div style={{ fontWeight: 800, fontSize: '15px', marginBottom: '6px' }}>No activity yet</div>
            <p style={{ fontSize: '12px', color: 'var(--text-3)', lineHeight: 1.6 }}>
              Complete your first lesson and your study streak will start growing here.
              <br />Every day you study lights up a cell!
            </p>
          </div>
        ) : (
          <>

        {/* ── Month labels ── */}
        <div style={{ display: 'flex', paddingLeft: '32px', marginBottom: '4px', position: 'relative', height: '14px' }}>
          {monthLabels.map(({ col, text }) => (
            <div key={col} style={{
              position: 'absolute',
              left: `${col * 16}px`,
              fontSize: '10px', color: 'var(--text-3)', fontWeight: 600,
              letterSpacing: '0.04em',
            }}>
              {text}
            </div>
          ))}
        </div>

        {/* ── Grid: day labels + cells ── */}
        <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-start' }}>

          {/* Day labels (Mon Wed Fri only for clean look) */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', marginRight: '4px', paddingTop: '0px' }}>
            {DAY_LABELS.map((d, i) => (
              <div key={d} style={{
                height: '13px', fontSize: '9px', fontWeight: 600,
                color: i % 2 === 1 ? 'var(--text-3)' : 'transparent',
                width: '22px', textAlign: 'right', lineHeight: '13px',
                userSelect: 'none',
              }}>
                {d}
              </div>
            ))}
          </div>

          {/* Columns */}
          <div style={{ display: 'flex', gap: '3px', overflowX: 'auto', paddingBottom: '2px' }}>
            {columns.map((col, colIdx) => (
              <div key={colIdx} style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
                {col.map((cell) => (
                  <HeatCell
                    key={cell.dateStr}
                    cell={cell}
                    visible={visible}
                    delay={colIdx * 28 + cell.row * 4}
                    onHover={handleHover}
                    onLeave={handleLeave}
                  />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── Stats row ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 'var(--sp-2)', marginTop: 'var(--sp-5)',
        }}>
          {[
            { icon: '🗓️', label: 'Active Days',  value: stats.active,   color: 'var(--primary)', bg: 'rgba(22,163,74,0.10)' },
            { icon: '🔥', label: 'Best Streak',  value: stats.best,     color: '#EF4444',        bg: 'rgba(239,68,68,0.10)' },
            { icon: '⚡', label: 'This Week XP', value: stats.weekXP,   color: '#F59E0B',        bg: 'rgba(245,158,11,0.10)' },
            { icon: '⭐', label: 'Total XP',     value: stats.totalXP,  color: '#8B5CF6',        bg: 'rgba(139,92,246,0.10)' },
          ].map((s, i) => (
            <div key={s.label} className="heat-stat-card"
              style={{
                background: s.bg, border: `1px solid ${s.color}22`,
                borderRadius: 'var(--radius-lg)', padding: 'var(--sp-3) var(--sp-2)',
                textAlign: 'center',
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(10px)',
                transition: `opacity 0.4s ease ${0.4 + i * 0.07}s, transform 0.4s ease ${0.4 + i * 0.07}s`,
              }}>
              <div style={{ fontSize: '18px', marginBottom: '2px' }}>{s.icon}</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: s.color, lineHeight: 1 }}>
                {visible ? <StatNum value={s.value} /> : 0}
              </div>
              <div style={{ fontSize: '9px', fontWeight: 700, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.04em', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* close the isAllEmpty ternary else branch */}
        </>
        )}

      </div>
    </>
  );
}
