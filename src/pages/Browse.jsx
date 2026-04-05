import React, { useState, useMemo } from 'react';
import { categoryMeta, colors, spacing, risk as riskTokens } from '../styles/tokens';
import { daysUntil, formatDate, formatRelative } from '../utils/dates';
import { RiskBadge, RiskDot } from '../components/shared/Badge';
import Icon from '../components/shared/Icon';

const CATEGORY_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'coverage', label: 'Coverage' },
  { key: 'expirations', label: 'Expirations' },
  { key: 'professional', label: 'Professional' },
  { key: 'references', label: 'References' },
];

const STATUS_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'action-needed', label: 'Action' },
  { key: 'critical', label: 'Critical' },
  { key: 'watch', label: 'Watch' },
  { key: 'stable', label: 'Stable' },
];

// ─── Filter chip ──────────────────────────────────────────────────────────────
function Chip({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: '7px 14px',
        borderRadius: 999,
        border: active ? '1.5px solid #2F3437' : `1px solid ${colors.border}`,
        background: active ? '#2F3437' : colors.surface,
        color: active ? '#FFFFFF' : colors.textSecondary,
        fontSize: 13,
        fontWeight: active ? 700 : 500,
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        flexShrink: 0,
        transition: 'all 0.15s',
      }}
    >
      {label}
    </button>
  );
}

// ─── Item card ────────────────────────────────────────────────────────────────
function ItemCard({ item, onClick }) {
  const catMeta = categoryMeta[item.category];
  const dateStr = item.expirationDate || item.dueDate;
  const rt = riskTokens[item.riskLevel];

  const subtypeLabel = item.subtype
    ? item.subtype
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : null;

  return (
    <button
      onClick={() => onClick(item.id)}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 13,
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
      {/* Icon */}
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          background: catMeta.bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon name={catMeta.icon} size={19} color={catMeta.color} />
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: colors.textPrimary, marginBottom: 3 }}>
          {item.title}
        </div>
        <div
          style={{
            fontSize: 12,
            color: colors.textSecondary,
            display: 'flex',
            alignItems: 'center',
            gap: 5,
            flexWrap: 'wrap',
          }}
        >
          <span>{catMeta.label}</span>
          {subtypeLabel && (
            <>
              <span style={{ color: colors.textTertiary }}>·</span>
              <span>{subtypeLabel}</span>
            </>
          )}
          {item.isRecurring && (
            <>
              <span style={{ color: colors.textTertiary }}>·</span>
              <span style={{ color: colors.textTertiary }}>Recurring</span>
            </>
          )}
        </div>
        {dateStr && (
          <div style={{ fontSize: 12, color: colors.textTertiary, marginTop: 3 }}>
            {formatDate(dateStr)}
          </div>
        )}
      </div>

      {/* Status + arrow */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
        <RiskBadge level={item.riskLevel} size="sm" />
        {dateStr && daysUntil(dateStr) != null && daysUntil(dateStr) < 365 && (
          <span style={{ fontSize: 11, color: rt.text, fontWeight: 600 }}>
            {formatRelative(dateStr)}
          </span>
        )}
      </div>

      <Icon name="chevron-right" size={15} color={colors.textTertiary} style={{ flexShrink: 0 }} />
    </button>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────
function EmptyState({ onAdd }) {
  return (
    <div style={{ textAlign: 'center', padding: '48px 24px' }}>
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          background: '#F0EDE8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
        }}
      >
        <Icon name="grid" size={24} color={colors.textTertiary} />
      </div>
      <div style={{ fontSize: 16, fontWeight: 700, color: colors.textPrimary, marginBottom: 6 }}>
        No items found
      </div>
      <div style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.5, marginBottom: 20 }}>
        Try adjusting your filters, or add a new item to start tracking.
      </div>
      <button
        onClick={onAdd}
        style={{
          background: '#2F3437',
          color: '#FFFFFF',
          border: 'none',
          borderRadius: 12,
          padding: '12px 20px',
          fontSize: 14,
          fontWeight: 600,
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Icon name="plus" size={16} color="#FFFFFF" /> Add Item
      </button>
    </div>
  );
}

// ─── Browse page ──────────────────────────────────────────────────────────────
export default function Browse({ items, onItemClick, onAddClick, initialCategory }) {
  const [catFilter, setCatFilter] = useState(initialCategory || 'all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return items
      .filter((item) => {
        if (catFilter !== 'all' && item.category !== catFilter) return false;
        if (statusFilter !== 'all' && item.riskLevel !== statusFilter) return false;
        if (search.trim()) {
          const q = search.toLowerCase();
          return (
            item.title.toLowerCase().includes(q) ||
            (item.providerOrIssuer || '').toLowerCase().includes(q) ||
            (item.notes || '').toLowerCase().includes(q) ||
            (item.subtype || '').toLowerCase().includes(q)
          );
        }
        return true;
      })
      .sort((a, b) => {
        // Sort: critical → action-needed → watch → stable, then by date
        const order = { critical: 0, 'action-needed': 1, watch: 2, stable: 3 };
        const diff = order[a.riskLevel] - order[b.riskLevel];
        if (diff !== 0) return diff;
        const aDate = a.expirationDate || a.dueDate;
        const bDate = b.expirationDate || b.dueDate;
        if (!aDate && !bDate) return 0;
        if (!aDate) return 1;
        if (!bDate) return -1;
        return new Date(aDate) - new Date(bDate);
      });
  }, [items, catFilter, statusFilter, search]);

  return (
    <div style={{ paddingTop: 'calc(env(safe-area-inset-top) + 16px)', paddingBottom: 24 }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingLeft: spacing.pagePad,
          paddingRight: spacing.pagePad,
          marginBottom: 16,
        }}
      >
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: colors.textPrimary, letterSpacing: -0.5 }}>
            Browse
          </div>
          <div style={{ fontSize: 12, color: colors.textTertiary, marginTop: 1 }}>
            {items.length} items tracked
          </div>
        </div>
        <button
          onClick={onAddClick}
          style={{
            background: '#2F3437',
            border: 'none',
            borderRadius: 12,
            width: 38,
            height: 38,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
          }}
        >
          <Icon name="plus" size={18} color="#FFFFFF" />
        </button>
      </div>

      {/* Search */}
      <div
        style={{
          paddingLeft: spacing.pagePad,
          paddingRight: spacing.pagePad,
          marginBottom: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: colors.surface,
            border: `1px solid ${colors.border}`,
            borderRadius: 12,
            padding: '0 14px',
          }}
        >
          <Icon name="search" size={16} color={colors.textTertiary} />
          <input
            type="text"
            placeholder="Search items…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 14,
              color: colors.textPrimary,
              padding: '11px 0',
              fontFamily: 'inherit',
            }}
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 4, display: 'flex' }}
            >
              <Icon name="x" size={14} color={colors.textTertiary} />
            </button>
          )}
        </div>
      </div>

      {/* Category filter chips */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingLeft: spacing.pagePad,
          paddingRight: spacing.pagePad,
          paddingBottom: 4,
          marginBottom: 8,
          scrollbarWidth: 'none',
        }}
      >
        {CATEGORY_FILTERS.map((f) => (
          <Chip
            key={f.key}
            label={f.label}
            active={catFilter === f.key}
            onClick={() => setCatFilter(f.key)}
          />
        ))}
      </div>

      {/* Status filter chips */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          overflowX: 'auto',
          paddingLeft: spacing.pagePad,
          paddingRight: spacing.pagePad,
          paddingBottom: 4,
          marginBottom: 16,
          scrollbarWidth: 'none',
        }}
      >
        {STATUS_FILTERS.map((f) => (
          <Chip
            key={f.key}
            label={f.label}
            active={statusFilter === f.key}
            onClick={() => setStatusFilter(f.key)}
          />
        ))}
      </div>

      {/* Results label */}
      {filtered.length > 0 && (
        <div
          style={{
            paddingLeft: spacing.pagePad,
            paddingRight: spacing.pagePad,
            marginBottom: 10,
            fontSize: 12,
            color: colors.textTertiary,
            fontWeight: 500,
          }}
        >
          {filtered.length} item{filtered.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Items list */}
      <div style={{ paddingLeft: spacing.pagePad, paddingRight: spacing.pagePad }}>
        {filtered.length === 0 ? (
          <EmptyState onAdd={onAddClick} />
        ) : (
          filtered.map((item) => (
            <ItemCard key={item.id} item={item} onClick={onItemClick} />
          ))
        )}
      </div>
    </div>
  );
}
