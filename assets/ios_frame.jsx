/**
 * Minimal iPhone-style frame for Babel inline bundles.
 * Copy `iosFrameStyles` + `IosFrame` into <script type="text/babel">.
 * For marketing-grade fidelity, replace constants with measured design specs.
 */
const iosFrameStyles = {
  shell: {
    width: 393,
    height: 852,
    borderRadius: 55,
    background: '#0a0a0a',
    boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
    padding: 12,
    boxSizing: 'border-box',
    position: 'relative',
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif',
  },
  screen: {
    width: '100%',
    height: '100%',
    borderRadius: 44,
    overflow: 'hidden',
    background: '#fff',
    position: 'relative',
  },
  island: {
    position: 'absolute',
    top: 12,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 124,
    height: 36,
    borderRadius: 24,
    background: '#000',
    zIndex: 20,
  },
  statusLeft: {
    position: 'absolute',
    top: 18,
    left: 28,
    zIndex: 15,
    fontSize: 15,
    fontWeight: 600,
    letterSpacing: '-0.02em',
    color: '#000',
  },
  statusRight: {
    position: 'absolute',
    top: 18,
    right: 26,
    zIndex: 15,
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 13,
    fontWeight: 600,
    color: '#000',
  },
  content: {
    paddingTop: 54,
    paddingBottom: 28,
    height: '100%',
    boxSizing: 'border-box',
    overflow: 'auto',
  },
  homeIndicator: {
    position: 'absolute',
    bottom: 10,
    left: '50%',
    transform: 'translateX(-50%)',
    width: 134,
    height: 5,
    borderRadius: 3,
    background: 'rgba(0,0,0,0.35)',
    zIndex: 20,
  },
};

function IosFrame({
  time = '9:41',
  battery = 100,
  children,
  dark = false,
}) {
  const ink = dark ? '#fff' : '#000';
  const islandBg = dark ? '#111' : '#000';
  const screenBg = dark ? '#000' : '#fff';
  return (
    <div style={iosFrameStyles.shell}>
      <div style={{ ...iosFrameStyles.screen, background: screenBg }}>
        <div style={{ ...iosFrameStyles.island, background: islandBg }} />
        <div style={{ ...iosFrameStyles.statusLeft, color: ink }}>{time}</div>
        <div style={{ ...iosFrameStyles.statusRight, color: ink }}>
          <span>5G</span>
          <BatteryGlyph level={battery} dark={dark} />
        </div>
        <div style={{ ...iosFrameStyles.content, color: ink }}>{children}</div>
        <div style={iosFrameStyles.homeIndicator} />
      </div>
    </div>
  );
}

function BatteryGlyph({ level, dark }) {
  const w = 22;
  const h = 11;
  const fill = dark ? '#d0f5c0' : '#34c759';
  const pct = Math.max(0, Math.min(100, level));
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden>
      <rect
        x={0.5}
        y={1.5}
        width={18}
        height={8}
        rx={2}
        fill="none"
        stroke={dark ? '#ccc' : '#000'}
        strokeOpacity={0.45}
      />
      <path
        d="M19 4v4"
        stroke={dark ? '#ccc' : '#000'}
        strokeOpacity={0.45}
        strokeWidth={1}
        strokeLinecap="round"
      />
      <rect
        x={2}
        y={3}
        width={(14 * pct) / 100}
        height={5}
        rx={1}
        fill={fill}
      />
    </svg>
  );
}

Object.assign(window, { IosFrame, iosFrameStyles });
