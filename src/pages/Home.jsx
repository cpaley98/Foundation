import React, { useMemo } from 'react';
import { categoryMeta, overallStatus as overallTokens, risk as riskTokens, colors, spacing } from '../styles/tokens';
import {
  computeOverallStatus,
  getImmediateItems,
  getUpcomingItems,
  getRecentlyVerified,
  getCategoryGroups,
} from '../utils/risk';
import { daysUntil, formatDate, formatRelative, formatVerified } from '../utils/dates';
import { RiskBadge, RiskDot } from '../components/shared/Badge';
import Icon from '../components/shared/Icon';

// ─── Section wrapper ──────────────────────────────────────────────────────────
function Section({ title, count, children, onMore }) {
  return (
    <div style={{ marginBottom: spacing.sectionGap }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 12,
          paddingLeft: spacing.pagePad,
          paddingRight: spacing.pagePad,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: 0.8,
              textTransform: 'uppercase',
              color: colors.textTertiary,
            }}
          >
            {title}
          </span>
          {count != null && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                background: '#EFEDE9',
                color: colors.textSecondary,
                borderRadius: 999,
                padding: '1px 7px',
              }}
            >
              {count}
            </span>
          )}
        </div>
        {onMore && (
          <button
            onClick={onMore}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12,
              fontWeight: 600,
              color: colors.textTertiary,
              padding: 0,
              display: 'flex',
              alignItems: 'center',
              gap: 2,
            }}
          >
            See all <Icon name="chevron-right" size={13} color={colors.textTertiary} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Hero card ────────────────────────────────────────────────────────────────
function HeroCard({ items, overallLevel }) {
  const token = overallTokens[overallLevel];
  const riskToken = riskTokens[overallLevel];
  const immediate = items.filter((i) => i.riskLevel === 'critical' || i.riskLevel === 'action-needed').length;
  const watching = items.filter((i) => i.riskLevel === 'watch').length;
  const stable = items.filter((i) => i.riskLevel === 'stable').length;

  const subtitle =
    overallLevel === 'stable'
      ? 'All systems are current and accounted for.'
      : overallLevel === 'watch'
      ? `${watching} item${watching !== 1 ? 's' : ''} approaching renewal.`
      : overallLevel === 'action-needed'
      ? `${immediate} item${immediate !== 1 ? 's' : ''} need attention soon.`
      : `${immediate} item${immediate !== 1 ? 's' : ''} require immediate action.`;

  return (
    <div
      style={{
        margin: `0 ${spacing.pagePad}px`,
        borderRadius: spacing.borderRadius,
        background: '#2F3437',
        padding: '22px 22px 20px',
        marginBottom: 8,
      }}
    >
      {/* Label row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 18,
        }}
      >
        <span
          style={{
            fontSize: 10,
            fontWeight: 700,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.45)',
          }}
        >
          Foundation Status
        </span>
        <RiskBadge level={overallLevel} size="sm" />
      </div>

      {/* Status line */}
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#FFFFFF',
          letterSpacing: -0.3,
          lineHeight: 1.2,
          marginBottom: 6,
        }}
      >
        {token.label}
      </div>
      <div
        style={{
          fontSize: 14,
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.5,
          marginBottom: 20,
        }}
      >
        {subtitle}
      </div>

      {/* Divider */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)', marginBottom: 16 }} />

      {/* Stats row */}
      <div style={{ display: 'flex', gap: 0 }}>
        {[
          { label: 'Tracked', value: items.length },
          { label: 'Watching', value: watching },
          { label: 'Action', value: immediate },
          { label: 'Stable', value: stable },
        ].map((stat, i) => (
          <div key={stat.label} style={{ flex: 1, textAlign: i === 0 ? 'left' : 'center' }}>
            <div
              style={{
                fontSize: 20,
                fontWeight: 700,
                color:
                  stat.label === 'Action' && immediate > 0
                    ? riskTokens['action-needed'].dot
                    : stat.label === 'Watching' && watching > 0
                    ? riskTokens['watch'].dot
                    : '#FFFFFF',
                letterSpacing: -0.5,
              }}
            >
              {stat.value}
            </div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 500, marginTop: 2, letterSpacing: 0.2 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Immediate attention card ─────────────────────────────────────────────────
function ImmediateCard({ item, onClick }) {
  const dateStr = item.expirationDate || item.dueDate;
  const days = daysUntil(dateStr);
  const catMeta = categoryMeta[item.category];
  const rt = riskTokens[item.riskLevel];

  return (
    <button
      onClick={() => onClick(item.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        width: '100%',
        background: rt.bg,
        border: `1px solid ${rt.border}`,
        borderRadius: spacing.borderRadius,
        padding: '14px 16px',
        cursor: 'pointer',
        textAlign: 'left',
        marginBottom: 8,
      }}
    >
      {/* Icon circle */}
      <div
        style={{
          width: 40,
          height: 40,
          borderRadius: 12,
          background: catMeta.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={catMeta.icon} size={18} color={catMeta.color} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, marginBottom: 3 }}>
          {item.title}
        </div>
        <div style={{ fontSize: 12, color: colors.textSecondary }}>
          {dateStr ? formatDate(dateStr) : item.providerOrIssuer || catMeta.label}
        </div>
      </div>

      {/* Countdown */}
      <div style={{ textAlign: 'right', flexShrink: 0 }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: rt.text, letterSpacing: -0.5, lineHeight: 1 }}>
          {days != null ? (days < 0 ? 'Overdue' : `${days}d`) : '—'}
        </div>
        <div style={{ fontSize: 10, color: rt.text, fontWeight: 500, marginTop: 2, opacity: 0.75 }}>
          {days != null && days >= 0 ? 'remaining' : ''}
        </div>
      </div>

      <Icon name="chevron-right" size={16} color={colors.textTertiary} />
    </button>
  );
}

// ─── Upcoming expiration row ──────────────────────────────────────────────────
function UpcomingRow({ item, onClick, last }) {
  const dateStr = item.expirationDate || item.dueDate;
  const catMeta = categoryMeta[item.category];
  const rt = riskTokens[item.riskLevel];

  return (
    <button
      onClick={() => onClick(item.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: `12px ${spacing.pagePad}px`,
        borderBottom: last ? 'none' : `1px solid ${colors.borderLight}`,
        textAlign: 'left',
      }}
    >
      <div
        style={{
          width: 34,
          height: 34,
          borderRadius: 10,
          background: catMeta.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={catMeta.icon} size={15} color={catMeta.color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{item.title}</div>
        <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 1 }}>
          {formatDate(dateStr)}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: rt.text,
            background: rt.bg,
            border: `1px solid ${rt.border}`,
            borderRadius: 999,
            padding: '2px 8px',
            whiteSpace: 'nowrap',
          }}
        >
          {formatRelative(dateStr)}
        </span>
        <Icon name="chevron-right" size={14} color={colors.textTertiary} />
      </div>
    </button>
  );
}

// ─── System overview card ─────────────────────────────────────────────────────
function SystemCard({ group, onClick }) {
  const rt = riskTokens[group.worstLevel];
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: spacing.borderRadius,
        padding: '14px 16px',
        cursor: 'pointer',
        textAlign: 'left',
        marginBottom: 8,
      }}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 11,
          background: group.meta.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={group.meta.icon} size={17} color={group.meta.color} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary }}>
          {group.meta.label}
        </div>
        <div style={{ fontSize: 12, color: colors.textSecondary, marginTop: 2 }}>
          {group.count} item{group.count !== 1 ? 's' : ''} ·{' '}
          {group.stableCount === group.count ? 'All stable' : `${group.stableCount}/${group.count} stable`}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <RiskDot level={group.worstLevel} size={9} />
        <Icon name="chevron-right" size={16} color={colors.textTertiary} />
      </div>
    </button>
  );
}

// ─── Recently verified row ────────────────────────────────────────────────────
function VerifiedRow({ item, onClick, last }) {
  const catMeta = categoryMeta[item.category];
  return (
    <button
      onClick={() => onClick(item.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        width: '100%',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        padding: `11px ${spacing.pagePad}px`,
        borderBottom: last ? 'none' : `1px solid ${colors.borderLight}`,
        textAlign: 'left',
      }}
    >
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 10,
          background: catMeta.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={catMeta.icon} size={14} color={catMeta.color} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>{item.title}</div>
        <div style={{ fontSize: 12, color: riskTokens.stable.text, marginTop: 1 }}>
          <Icon name="check-circle" size={11} color={riskTokens.stable.text} style={{ display: 'inline', marginRight: 3 }} />
          {formatVerified(item.lastVerified)}
        </div>
      </div>

      <Icon name="chevron-right" size={14} color={colors.textTertiary} />
    </button>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ icon, title, subtitle }) {
  return (
    <div
      style={{
        textAlign: 'center',
        padding: '28px 24px',
        color: colors.textTertiary,
      }}
    >
      <div style={{ marginBottom: 8 }}>
        <Icon name={icon} size={24} color={colors.textTertiary} />
      </div>
      <div style={{ fontSize: 14, fontWeight: 600, color: colors.textSecondary, marginBottom: 4 }}>
        {title}
      </div>
      <div style={{ fontSize: 13, lineHeight: 1.5 }}>{subtitle}</div>
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────
function Card({ children, noPad }) {
  return (
    <div
      style={{
        background: colors.surface,
        border: `1px solid ${colors.border}`,
        borderRadius: spacing.borderRadius,
        overflow: 'hidden',
        ...(noPad ? {} : { padding: spacing.cardPad }),
      }}
    >
      {children}
    </div>
  );
}

// ─── Home page ────────────────────────────────────────────────────────────────
export default function Home({ items, onItemClick, onCategoryClick }) {
  const overallLevel = useMemo(() => computeOverallStatus(items), [items]);
  const immediateItems = useMemo(() => getImmediateItems(items), [items]);
  const upcomingItems = useMemo(() => getUpcomingItems(items, 365).slice(0, 6), [items]);
  const recentlyVerified = useMemo(() => getRecentlyVerified(items, 30).slice(0, 4), [items]);
  const categoryGroups = useMemo(() => getCategoryGroups(items, categoryMeta), [items]);

  const pad = { paddingLeft: spacing.pagePad, paddingRight: spacing.pagePad };

  return (
    <div style={{ paddingTop: 16, paddingBottom: 24 }}>
      {/* Wordmark header */}
      <div
        style={{
          ...pad,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
        }}
      >
        <div>
          <div
            style={{
              fontSize: 22,
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: -0.5,
            }}
          >
            Foundation
          </div>
          <div style={{ fontSize: 12, color: colors.textTertiary, marginTop: 1 }}>
            Life infrastructure dashboard
          </div>
        </div>
        {/* Foundation logo mark — three stacked blocks */}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            background: '#2F3437',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="3" y="0" width="14" height="3.5" rx="1.2" fill="white" fillOpacity="0.9"/>
            <rect x="1.5" y="5" width="17" height="4" rx="1.2" fill="white" fillOpacity="0.9"/>
            <rect x="0" y="10.5" width="20" height="5" rx="1.2" fill="white" fillOpacity="0.9"/>
          </svg>
        </div>
      </div>

      {/* Hero card */}
      <div style={{ marginBottom: spacing.sectionGap }}>
        <HeroCard items={items} overallLevel={overallLevel} />
      </div>

      {/* Immediate Attention — only if needed */}
      {immediateItems.length > 0 && (
        <Section title="Immediate Attention" count={immediateItems.length}>
          <div style={pad}>
            {immediateItems.map((item) => (
              <ImmediateCard key={item.id} item={item} onClick={onItemClick} />
            ))}
          </div>
        </Section>
      )}

      {/* Upcoming Expirations */}
      {upcomingItems.length > 0 && (
        <Section title="Upcoming Expirations" count={upcomingItems.length}>
          <div style={{ ...pad }}>
            <Card noPad>
              {upcomingItems.map((item, i) => (
                <UpcomingRow
                  key={item.id}
                  item={item}
                  onClick={onItemClick}
                  last={i === upcomingItems.length - 1}
                />
              ))}
            </Card>
          </div>
        </Section>
      )}

      {/* System Overview */}
      <Section title="System Overview">
        <div style={pad}>
          {categoryGroups
            .filter((g) => g.count > 0)
            .map((group) => (
              <SystemCard
                key={group.key}
                group={group}
                onClick={() => onCategoryClick && onCategoryClick(group.key)}
              />
            ))}
        </div>
      </Section>

      {/* Recently Verified */}
      {recentlyVerified.length > 0 && (
        <Section title="Recently Verified" count={recentlyVerified.length}>
          <div style={pad}>
            <Card noPad>
              {recentlyVerified.map((item, i) => (
                <VerifiedRow
                  key={item.id}
                  item={item}
                  onClick={onItemClick}
                  last={i === recentlyVerified.length - 1}
                />
              ))}
            </Card>
          </div>
        </Section>
      )}

      {/* Privacy note footer */}
      <div
        style={{
          ...pad,
          padding: '16px 20px',
          marginLeft: spacing.pagePad,
          marginRight: spacing.pagePad,
          background: '#F9F8F6',
          border: `1px solid ${colors.border}`,
          borderRadius: 14,
          display: 'flex',
          gap: 10,
          alignItems: 'flex-start',
        }}
      >
        <Icon name="lock" size={14} color={colors.textTertiary} style={{ marginTop: 1, flexShrink: 0 }} />
        <p
          style={{
            fontSize: 12,
            color: colors.textTertiary,
            lineHeight: 1.6,
            margin: 0,
          }}
        >
          Foundation stores only reference metadata — not full account numbers, document IDs, or
          credentials. Keep sensitive documents stored securely elsewhere.
        </p>
      </div>
    </div>
  );
}
