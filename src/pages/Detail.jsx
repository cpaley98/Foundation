import React, { useState } from 'react';
import { categoryMeta, colors, spacing, risk as riskTokens } from '../styles/tokens';
import { daysUntil, formatDate, formatRelativeLong, formatVerified } from '../utils/dates';
import { RiskBadge } from '../components/shared/Badge';
import Icon from '../components/shared/Icon';

// ─── Section label ────────────────────────────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div
      style={{
        fontSize: 10,
        fontWeight: 700,
        letterSpacing: 0.9,
        textTransform: 'uppercase',
        color: colors.textTertiary,
        marginBottom: 10,
        marginTop: 24,
      }}
    >
      {children}
    </div>
  );
}

// ─── Info row ─────────────────────────────────────────────────────────────────
function InfoRow({ icon, label, value, link, last }) {
  if (!value) return null;

  const inner = (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 12,
        padding: '13px 16px',
        borderBottom: last ? 'none' : `1px solid ${colors.borderLight}`,
      }}
    >
      <div style={{ marginTop: 1, flexShrink: 0, color: colors.textTertiary }}>
        <Icon name={icon} size={15} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 11, color: colors.textTertiary, fontWeight: 500, marginBottom: 3 }}>
          {label}
        </div>
        <div
          style={{
            fontSize: 14,
            color: link ? '#2F3437' : colors.textPrimary,
            fontWeight: 500,
            wordBreak: 'break-word',
            lineHeight: 1.4,
          }}
        >
          {value}
        </div>
      </div>
      {link && (
        <div style={{ flexShrink: 0, color: colors.textTertiary, marginTop: 2 }}>
          <Icon name="external-link" size={13} />
        </div>
      )}
    </div>
  );

  if (link) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
      >
        {inner}
      </a>
    );
  }
  return inner;
}

// ─── Delete confirmation ──────────────────────────────────────────────────────
function DeleteConfirm({ onConfirm, onCancel }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 200,
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        padding: '0 16px 32px',
      }}
    >
      <div
        style={{
          background: colors.surface,
          borderRadius: 20,
          padding: 24,
          width: '100%',
          maxWidth: 400,
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 700, color: colors.textPrimary, marginBottom: 8 }}>
          Delete this item?
        </div>
        <div style={{ fontSize: 14, color: colors.textSecondary, lineHeight: 1.5, marginBottom: 24 }}>
          This will permanently remove the item from Foundation. This action cannot be undone.
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: '13px 0',
              borderRadius: 12,
              border: `1px solid ${colors.border}`,
              background: colors.surface,
              fontSize: 15,
              fontWeight: 600,
              color: colors.textPrimary,
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: '13px 0',
              borderRadius: 12,
              border: 'none',
              background: '#DC2626',
              fontSize: 15,
              fontWeight: 700,
              color: '#FFFFFF',
              cursor: 'pointer',
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Detail page ──────────────────────────────────────────────────────────────
export default function Detail({ item, onBack, onEdit, onDelete, onMarkVerified }) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [justVerified, setJustVerified] = useState(false);

  if (!item) {
    return (
      <div style={{ padding: 24, textAlign: 'center', color: colors.textSecondary }}>
        Item not found.
        <button onClick={onBack} style={{ display: 'block', margin: '16px auto', cursor: 'pointer' }}>
          Go back
        </button>
      </div>
    );
  }

  const catMeta = categoryMeta[item.category];
  const rt = riskTokens[item.riskLevel];
  const dateStr = item.expirationDate || item.dueDate;
  const days = daysUntil(dateStr);
  const isDateItem = !!dateStr && !item.isRecurring;

  const hasProviderOrContact =
    item.providerOrIssuer || item.partialReference || item.renewalUrl || item.contactPhone;

  const subtypeLabel = item.subtype
    ? item.subtype
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ')
    : null;

  function handleMarkVerified() {
    onMarkVerified(item.id);
    setJustVerified(true);
  }

  return (
    <>
      {showDeleteConfirm && (
        <DeleteConfirm
          onConfirm={() => {
            setShowDeleteConfirm(false);
            onDelete(item.id);
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      <div style={{ paddingBottom: 40 }}>
        {/* Navigation bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: `calc(env(safe-area-inset-top) + 14px) ${spacing.pagePad}px 12px`,
            borderBottom: `1px solid ${colors.borderLight}`,
            background: colors.pageBg,
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <button
            onClick={onBack}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: colors.textSecondary,
              fontSize: 14,
              fontWeight: 600,
              padding: 0,
            }}
          >
            <Icon name="arrow-left" size={18} color={colors.textSecondary} />
            Back
          </button>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={onEdit}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: colors.surface,
                border: `1px solid ${colors.border}`,
                borderRadius: 10,
                padding: '7px 12px',
                cursor: 'pointer',
                fontSize: 13,
                fontWeight: 600,
                color: colors.textSecondary,
              }}
            >
              <Icon name="edit" size={13} color={colors.textSecondary} />
              Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                background: '#FFF1F2',
                border: '1px solid #FECDD3',
                borderRadius: 10,
                padding: '7px 10px',
                cursor: 'pointer',
              }}
            >
              <Icon name="trash" size={13} color="#DC2626" />
            </button>
          </div>
        </div>

        {/* Hero section */}
        <div
          style={{
            padding: `24px ${spacing.pagePad}px 20px`,
            borderBottom: `1px solid ${colors.border}`,
            background: colors.surface,
          }}
        >
          {/* Category icon */}
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 16,
              background: catMeta.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Icon name={catMeta.icon} size={24} color={catMeta.color} />
          </div>

          {/* Category + subtype */}
          <div
            style={{
              fontSize: 12,
              color: colors.textTertiary,
              fontWeight: 600,
              marginBottom: 6,
              display: 'flex',
              gap: 6,
              alignItems: 'center',
            }}
          >
            <span style={{ color: catMeta.color }}>{catMeta.label}</span>
            {subtypeLabel && (
              <>
                <span style={{ color: colors.textTertiary }}>·</span>
                <span>{subtypeLabel}</span>
              </>
            )}
            {item.isRecurring && (
              <>
                <span>·</span>
                <span>Recurring</span>
              </>
            )}
          </div>

          {/* Title */}
          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: colors.textPrimary,
              letterSpacing: -0.4,
              lineHeight: 1.2,
              marginBottom: 12,
            }}
          >
            {item.title}
          </div>

          {/* Status badge */}
          <RiskBadge level={item.riskLevel} size="md" />

          {/* Countdown — only for dated non-recurring items */}
          {isDateItem && days !== null && (
            <div
              style={{
                marginTop: 16,
                padding: '14px 16px',
                background: rt.bg,
                border: `1px solid ${rt.border}`,
                borderRadius: 14,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: 11, color: rt.text, fontWeight: 600, marginBottom: 3, opacity: 0.7 }}>
                  {item.expirationDate ? 'Expires' : 'Due'}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, color: rt.text }}>
                  {formatDate(dateStr)}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div
                  style={{
                    fontSize: 28,
                    fontWeight: 800,
                    color: rt.text,
                    letterSpacing: -1,
                    lineHeight: 1,
                  }}
                >
                  {days < 0 ? `${Math.abs(days)}` : days}
                </div>
                <div style={{ fontSize: 12, color: rt.text, fontWeight: 600, opacity: 0.75 }}>
                  {days < 0 ? 'days overdue' : days === 0 ? 'due today' : 'days left'}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Details */}
        <div style={{ padding: `0 ${spacing.pagePad}px` }}>
          {/* Provider / reference info */}
          {hasProviderOrContact && (
            <>
              <SectionLabel>Details</SectionLabel>
              <div
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: spacing.borderRadius,
                  overflow: 'hidden',
                }}
              >
                <InfoRow
                  icon="briefcase"
                  label="Provider / Issuer"
                  value={item.providerOrIssuer}
                />
                <InfoRow
                  icon="bookmark"
                  label="Reference"
                  value={item.partialReference}
                />
                <InfoRow
                  icon="external-link"
                  label="Renewal / Portal URL"
                  value={item.renewalUrl ? new URL(item.renewalUrl).hostname.replace('www.', '') : null}
                  link={item.renewalUrl}
                />
                <InfoRow
                  icon="phone"
                  label="Contact Phone"
                  value={item.contactPhone}
                  link={item.contactPhone ? `tel:${item.contactPhone}` : null}
                  last={!item.notes}
                />
              </div>
            </>
          )}

          {/* Notes */}
          {item.notes && (
            <>
              <SectionLabel>Notes</SectionLabel>
              <div
                style={{
                  background: colors.surface,
                  border: `1px solid ${colors.border}`,
                  borderRadius: spacing.borderRadius,
                  padding: '14px 16px',
                  fontSize: 14,
                  color: colors.textPrimary,
                  lineHeight: 1.65,
                }}
              >
                {item.notes}
              </div>
            </>
          )}

          {/* Last verified */}
          <SectionLabel>Verification</SectionLabel>
          <div
            style={{
              background: colors.surface,
              border: `1px solid ${colors.border}`,
              borderRadius: spacing.borderRadius,
              padding: '14px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <Icon
              name="check-circle"
              size={18}
              color={justVerified ? riskTokens.stable.dot : colors.textTertiary}
            />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: colors.textPrimary }}>
                {justVerified ? 'Verified today' : formatVerified(item.lastVerified)}
              </div>
              <div style={{ fontSize: 12, color: colors.textTertiary, marginTop: 2 }}>
                Confirms this item is still accurate and current
              </div>
            </div>
          </div>

          {/* Privacy note */}
          <SectionLabel>Privacy</SectionLabel>
          <div
            style={{
              background: '#F9F8F6',
              border: `1px solid ${colors.border}`,
              borderRadius: spacing.borderRadius,
              padding: '13px 16px',
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
              Foundation stores metadata only. Never enter full document numbers, SSNs, payment
              card numbers, or full account credentials here. Keep sensitive documents stored
              securely elsewhere.
            </p>
          </div>

          {/* Action button row */}
          <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
            <button
              onClick={handleMarkVerified}
              disabled={justVerified}
              style={{
                flex: 1,
                padding: '14px 0',
                borderRadius: 14,
                border: `1.5px solid ${justVerified ? riskTokens.stable.border : colors.border}`,
                background: justVerified ? riskTokens.stable.bg : colors.surface,
                fontSize: 14,
                fontWeight: 700,
                color: justVerified ? riskTokens.stable.text : colors.textPrimary,
                cursor: justVerified ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              <Icon
                name="check-square"
                size={16}
                color={justVerified ? riskTokens.stable.text : colors.textSecondary}
              />
              {justVerified ? 'Verified' : 'Mark Verified'}
            </button>

            {item.actionLabel && item.renewalUrl && (
              <a
                href={item.renewalUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  flex: 1,
                  padding: '14px 0',
                  borderRadius: 14,
                  background: '#2F3437',
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  textDecoration: 'none',
                }}
              >
                <Icon name="external-link" size={14} color="#FFFFFF" />
                {item.actionLabel}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
