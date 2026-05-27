import { type CSSProperties, type MouseEvent as ReactMouseEvent, useEffect, useMemo, useRef, useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const navItems = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/organisation-context', label: 'Organisation Context' },
  { to: '/maturity-roadmap', label: 'Maturity Roadmap' },
  { to: '/frameworks', label: 'Frameworks' },
  { to: '/dmc', label: 'DMC' },
];

const SIDEBAR_MIN = 96;
const SIDEBAR_MAX = 240;

function clampSidebarWidth(value: number): number {
  return Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, value));
}

function getAutoSidebarWidth(): number {
  if (typeof window === 'undefined') return 148;
  const canvas = window.document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return 148;
  const bodyStyle = window.getComputedStyle(window.document.body);
  ctx.font = `${bodyStyle.fontSize} ${bodyStyle.fontFamily}`;
  const widestLabel = navItems.reduce((max, item) => {
    const width = ctx.measureText(item.label).width;
    return Math.max(max, width);
  }, 0);
  // label width + nav-link padding + sidebar inner padding + safety
  return clampSidebarWidth(Math.ceil(widestLabel + 58));
}

export default function AuthenticatedAppShell() {
  const [sidebarWidth, setSidebarWidth] = useState(() => getAutoSidebarWidth());
  const dragState = useRef<{ startX: number; startWidth: number } | null>(null);

  useEffect(() => {
    const raw = window.localStorage.getItem('mmm.sidebar.width');
    const parsed = raw ? Number(raw) : NaN;
    if (Number.isFinite(parsed)) {
      setSidebarWidth(clampSidebarWidth(parsed));
      return;
    }
    const auto = getAutoSidebarWidth();
    setSidebarWidth(auto);
    window.localStorage.setItem('mmm.sidebar.width', String(auto));
  }, []);

  const shellStyle = useMemo(
    () => ({ '--mmm-sidebar-width': `${sidebarWidth}px` } as CSSProperties),
    [sidebarWidth],
  );

  const handleDragStart = (clientX: number) => {
    dragState.current = { startX: clientX, startWidth: sidebarWidth };
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!dragState.current) return;
      const delta = event.clientX - dragState.current.startX;
      const next = clampSidebarWidth(dragState.current.startWidth + delta);
      setSidebarWidth(next);
    };
    const handleMouseUp = () => {
      if (!dragState.current) return;
      dragState.current = null;
      window.localStorage.setItem('mmm.sidebar.width', String(sidebarWidth));
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [sidebarWidth]);

  const onResizeHandleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    handleDragStart(event.clientX);
  };

  return (
    <div className="mmm-shell" data-testid="authenticated-app-shell" style={shellStyle}>
      <aside className="mmm-shell__sidebar" aria-label="MMM sidebar">
        <div className="mmm-shell__brand">Maturion <span>MMM</span></div>
        <nav className="mmm-shell__nav">
          {navItems.map((item) => (
            <NavLink
              key={`${item.to}-${item.label}`}
              to={item.to}
              className={({ isActive }) =>
                `mmm-shell__nav-link${isActive ? ' mmm-shell__nav-link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div
        className="mmm-shell__resize-handle"
        aria-label="Resize sidebar"
        role="separator"
        aria-orientation="vertical"
        onMouseDown={onResizeHandleMouseDown}
      />
      <section className="mmm-shell__content">
        <Outlet />
      </section>
    </div>
  );
}
