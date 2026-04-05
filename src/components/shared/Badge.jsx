import { risk as riskTokens } from '../../styles/tokens';
import Icon from './Icon';

// Risk-level status badge
export function RiskBadge({ level, size = 'md' }) {
  const token = riskTokens[level] ?? riskTokens.stable;
  const pad = size === 'sm' ? '3px 8px' : size === 'lg' ? '6px 14px' : '4px 10px';
  const fontSize = size === 'sm' ? 11 : size === 'lg' ? 14 : 12;
  const dotSize = size === 'sm' ? 6 : size === 'lg' ? 9 : 7;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        padding: pad,
        borderRadius: 999,
        background: token.bg,
        border: `1px solid ${token.border}`,
        color: token.text,
        fontSize,
        fontWeight: 600,
        letterSpacing: 0.1,
        whiteSpace: 'nowrap',
        lineHeight: 1,
      }}
    >
      <span
        style={{
          width: dotSize,
          height: dotSize,
          borderRadius: '50%',
          background: token.dot,
          flexShrink: 0,
        }}
      />
      {token.label}
    </span>
  );
}

// Category label badge (muted pill)
export function CategoryBadge({ label, color, bg }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '3px 9px',
        borderRadius: 999,
        background: bg || '#F3F4F6',
        color: color || '#6B7280',
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: 0.2,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

// Risk dot only (for compact displays)
export function RiskDot({ level, size = 8 }) {
  const token = riskTokens[level] ?? riskTokens.stable;
  return (
    <span
      style={{
        display: 'inline-block',
        width: size,
        height: size,
        borderRadius: '50%',
        background: token.dot,
        flexShrink: 0,
      }}
    />
  );
}

// Simple icon+text info row
export function InfoRow({ icon, label, value, onClick, href }) {
  if (!value) return null;
  const inner = (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '10px 0',
      }}
    >
      <span style={{ color: '#9C9893', marginTop: 1, flexShrink: 0 }}>
        <Icon name={icon} size={16} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 11, color: '#9C9893', fontWeight: 500, marginBottom: 2 }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 14,
            color: href || onClick ? '#2F3437' : '#1A1917',
            fontWeight: 500,
            wordBreak: 'break-word',
            textDecoration: href ? 'underline' : 'none',
          }}
        >
          {value}
        </div>
      </div>
      {(href || onClick) && (
        <span style={{ marginLeft: 'auto', color: '#9C9893', flexShrink: 0 }}>
          <Icon name={href ? 'external-link' : 'chevron-right'} size={14} />
        </span>
      )}
    </div>
  );

  const style = {
    borderBottom: '1px solid #EFEDE9',
    cursor: href || onClick ? 'pointer' : 'default',
    textDecoration: 'none',
    color: 'inherit',
    display: 'block',
  };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" style={style}>
        {inner}
      </a>
    );
  }
  if (onClick) {
    return (
      <button onClick={onClick} style={{ ...style, background: 'none', border: 'none', width: '100%', textAlign: 'left', padding: 0 }}>
        {inner}
      </button>
    );
  }
  return <div style={style}>{inner}</div>;
}
