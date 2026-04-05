import React, { useState } from 'react';
import { categoryMeta, colors, spacing } from '../styles/tokens';
import { todayISO } from '../utils/dates';
import Icon from '../components/shared/Icon';

// ─── Category → subtypes map ──────────────────────────────────────────────────
const SUBTYPES = {
  coverage: [
    { key: 'health', label: 'Health' },
    { key: 'dental', label: 'Dental' },
    { key: 'vision', label: 'Vision' },
    { key: 'renters', label: "Renter's" },
    { key: 'auto', label: 'Auto' },
    { key: 'pet', label: 'Pet' },
    { key: 'life', label: 'Life' },
    { key: 'other', label: 'Other' },
  ],
  expirations: [
    { key: 'passport', label: 'Passport' },
    { key: 'tsa-precheck', label: 'TSA PreCheck' },
    { key: 'drivers-license', label: "Driver's License" },
    { key: 'car-registration', label: 'Car Registration' },
    { key: 'id-card', label: 'State ID / ID Card' },
    { key: 'other', label: 'Other' },
  ],
  professional: [
    { key: 'pharmacist-license', label: 'Pharmacist License' },
    { key: 'medical-license', label: 'Medical License' },
    { key: 'nursing-license', label: 'Nursing License' },
    { key: 'ce-checkpoint', label: 'CE Checkpoint' },
    { key: 'certification', label: 'Certification' },
    { key: 'other', label: 'Other' },
  ],
  references: [
    { key: 'contact', label: 'Contact' },
    { key: 'document-location', label: 'Document Location' },
    { key: 'portal', label: 'Portal / Account' },
    { key: 'other', label: 'Other' },
  ],
};

// Default reminder lead times per subtype (days)
const DEFAULT_LEAD_TIMES = {
  passport: 365,
  'tsa-precheck': 180,
  'drivers-license': 90,
  'car-registration': 60,
  'pharmacist-license': 180,
  'medical-license': 180,
  'nursing-license': 180,
  'ce-checkpoint': 90,
  health: 30,
  dental: 30,
  vision: 30,
  renters: 60,
  auto: 30,
  pet: 60,
  life: 60,
  default: 60,
};

// ─── Form field ───────────────────────────────────────────────────────────────
function Field({ label, hint, required, children, error }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
        <label
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: colors.textSecondary,
            letterSpacing: 0.3,
          }}
        >
          {label}
          {required && (
            <span style={{ color: '#DC2626', marginLeft: 3 }}>*</span>
          )}
        </label>
        {hint && (
          <span style={{ fontSize: 11, color: colors.textTertiary }}>{hint}</span>
        )}
      </div>
      {children}
      {error && (
        <div style={{ fontSize: 12, color: '#DC2626', marginTop: 5 }}>{error}</div>
      )}
    </div>
  );
}

// ─── Styled input ─────────────────────────────────────────────────────────────
const inputStyle = {
  width: '100%',
  boxSizing: 'border-box',
  background: colors.surface,
  border: `1px solid ${colors.border}`,
  borderRadius: 12,
  padding: '12px 14px',
  fontSize: 15,
  color: colors.textPrimary,
  fontFamily: 'inherit',
  outline: 'none',
};

// ─── AddEdit page ─────────────────────────────────────────────────────────────
export default function AddEdit({ item, onBack, onSave }) {
  const isEditing = !!item;

  const [form, setForm] = useState({
    category: item?.category ?? 'coverage',
    subtype: item?.subtype ?? 'health',
    title: item?.title ?? '',
    providerOrIssuer: item?.providerOrIssuer ?? '',
    partialReference: item?.partialReference ?? '',
    expirationDate: item?.expirationDate ?? '',
    reminderLeadTime: item?.reminderLeadTime ?? 60,
    renewalUrl: item?.renewalUrl ?? '',
    contactPhone: item?.contactPhone ?? '',
    notes: item?.notes ?? '',
    lastVerified: item?.lastVerified ?? todayISO(),
    actionLabel: item?.actionLabel ?? '',
  });

  const [errors, setErrors] = useState({});

  function set(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: null }));
  }

  function handleCategoryChange(cat) {
    const firstSubtype = SUBTYPES[cat]?.[0]?.key ?? '';
    const lead = DEFAULT_LEAD_TIMES[firstSubtype] ?? DEFAULT_LEAD_TIMES.default;
    setForm((prev) => ({
      ...prev,
      category: cat,
      subtype: firstSubtype,
      reminderLeadTime: lead,
    }));
  }

  function handleSubtypeChange(st) {
    const lead = DEFAULT_LEAD_TIMES[st] ?? DEFAULT_LEAD_TIMES.default;
    setForm((prev) => ({ ...prev, subtype: st, reminderLeadTime: lead }));
  }

  function validate() {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required.';
    if (!form.category) e.category = 'Category is required.';
    return e;
  }

  function handleSave() {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    const payload = {
      ...(isEditing ? { id: item.id } : {}),
      title: form.title.trim(),
      category: form.category,
      subtype: form.subtype,
      providerOrIssuer: form.providerOrIssuer.trim() || null,
      partialReference: form.partialReference.trim() || null,
      expirationDate: form.expirationDate || null,
      reminderLeadTime: Number(form.reminderLeadTime) || 60,
      renewalUrl: form.renewalUrl.trim() || null,
      contactPhone: form.contactPhone.trim() || null,
      notes: form.notes.trim() || null,
      lastVerified: form.lastVerified || todayISO(),
      actionLabel: form.actionLabel.trim() || null,
    };

    onSave(payload);
  }

  const isDateCategory = form.category !== 'references';

  return (
    <div style={{ paddingBottom: 40 }}>
      {/* Nav bar */}
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
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 600,
            color: colors.textSecondary,
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Icon name="arrow-left" size={18} color={colors.textSecondary} />
          Cancel
        </button>
        <div style={{ fontSize: 15, fontWeight: 700, color: colors.textPrimary }}>
          {isEditing ? 'Edit Item' : 'Add Item'}
        </div>
        <button
          onClick={handleSave}
          style={{
            background: '#2F3437',
            border: 'none',
            borderRadius: 10,
            padding: '8px 16px',
            fontSize: 14,
            fontWeight: 700,
            color: '#FFFFFF',
            cursor: 'pointer',
          }}
        >
          Save
        </button>
      </div>

      {/* Form body */}
      <div style={{ padding: `20px ${spacing.pagePad}px` }}>

        {/* Category */}
        <Field label="Category" required>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {Object.entries(categoryMeta).map(([key, meta]) => (
              <button
                key={key}
                onClick={() => handleCategoryChange(key)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 12px',
                  borderRadius: 10,
                  border:
                    form.category === key
                      ? `1.5px solid #2F3437`
                      : `1px solid ${colors.border}`,
                  background: form.category === key ? '#2F3437' : colors.surface,
                  color: form.category === key ? '#FFFFFF' : colors.textSecondary,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                <Icon
                  name={meta.icon}
                  size={14}
                  color={form.category === key ? '#FFFFFF' : meta.color}
                />
                {meta.label}
              </button>
            ))}
          </div>
        </Field>

        {/* Subtype */}
        {SUBTYPES[form.category] && (
          <Field label="Type">
            <select
              value={form.subtype}
              onChange={(e) => handleSubtypeChange(e.target.value)}
              style={{ ...inputStyle, appearance: 'none' }}
            >
              {SUBTYPES[form.category].map((st) => (
                <option key={st.key} value={st.key}>
                  {st.label}
                </option>
              ))}
            </select>
          </Field>
        )}

        {/* Title */}
        <Field label="Title" required error={errors.title}>
          <input
            type="text"
            placeholder="e.g. Renters Insurance, Passport, Student Loan"
            value={form.title}
            onChange={(e) => set('title', e.target.value)}
            style={{
              ...inputStyle,
              borderColor: errors.title ? '#DC2626' : colors.border,
            }}
          />
        </Field>

        {/* Provider / Issuer */}
        <Field label="Provider / Issuer">
          <input
            type="text"
            placeholder="e.g. Lemonade, CA DMV, Chase"
            value={form.providerOrIssuer}
            onChange={(e) => set('providerOrIssuer', e.target.value)}
            style={inputStyle}
          />
        </Field>

        {/* Partial Reference */}
        <Field label="Reference Note" hint="No full IDs">
          <input
            type="text"
            placeholder="e.g. Last 4 digits, policy ends Jun 12, KTN ends May 2026"
            value={form.partialReference}
            onChange={(e) => set('partialReference', e.target.value)}
            style={inputStyle}
          />
          <div
            style={{
              marginTop: 6,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 6,
              padding: '8px 10px',
              background: '#F9F8F6',
              border: `1px solid ${colors.border}`,
              borderRadius: 9,
            }}
          >
            <Icon name="lock" size={12} color={colors.textTertiary} style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: colors.textTertiary, lineHeight: 1.5 }}>
              Use only a reference note — not full account numbers, SSNs, or credentials.
            </span>
          </div>
        </Field>

        {/* Date fields */}
        {isDateCategory && (
          <Field label="Expiration Date">
            <input
              type="date"
              value={form.expirationDate}
              onChange={(e) => set('expirationDate', e.target.value)}
              style={inputStyle}
            />
          </Field>
        )}

        {/* Reminder Lead Time */}
        {isDateCategory && (
          <Field label="Remind me" hint={`${form.reminderLeadTime} days before`}>
            <input
              type="range"
              min={7}
              max={365}
              step={7}
              value={form.reminderLeadTime}
              onChange={(e) => set('reminderLeadTime', e.target.value)}
              style={{ width: '100%', accentColor: '#2F3437' }}
            />
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontSize: 11,
                color: colors.textTertiary,
                marginTop: 4,
              }}
            >
              <span>1 week</span>
              <span style={{ fontWeight: 700, color: colors.textSecondary }}>
                {form.reminderLeadTime} days
              </span>
              <span>1 year</span>
            </div>
          </Field>
        )}

        {/* Renewal URL */}
        <Field label="Renewal / Portal URL">
          <input
            type="url"
            placeholder="https://..."
            value={form.renewalUrl}
            onChange={(e) => set('renewalUrl', e.target.value)}
            style={inputStyle}
          />
        </Field>

        {/* Contact Phone */}
        <Field label="Contact Phone">
          <input
            type="tel"
            placeholder="e.g. 1-800-000-0000"
            value={form.contactPhone}
            onChange={(e) => set('contactPhone', e.target.value)}
            style={inputStyle}
          />
        </Field>

        {/* Action label */}
        <Field label="Action Button Label" hint="Optional">
          <input
            type="text"
            placeholder="e.g. Renew Online, View Policy, Schedule Appointment"
            value={form.actionLabel}
            onChange={(e) => set('actionLabel', e.target.value)}
            style={inputStyle}
          />
        </Field>

        {/* Notes */}
        <Field label="Notes">
          <textarea
            placeholder="Anything useful — where physical documents are stored, what to watch for, auto-pay status, etc."
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
            rows={4}
            style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
          />
          <div
            style={{
              marginTop: 6,
              display: 'flex',
              alignItems: 'flex-start',
              gap: 6,
              padding: '8px 10px',
              background: '#F9F8F6',
              border: `1px solid ${colors.border}`,
              borderRadius: 9,
            }}
          >
            <Icon name="lock" size={12} color={colors.textTertiary} style={{ marginTop: 1, flexShrink: 0 }} />
            <span style={{ fontSize: 11, color: colors.textTertiary, lineHeight: 1.5 }}>
              Use notes for context, not sensitive data. Store sensitive credentials and full
              document contents securely elsewhere.
            </span>
          </div>
        </Field>

        {/* Last verified */}
        <Field label="Last Verified">
          <input
            type="date"
            value={form.lastVerified}
            onChange={(e) => set('lastVerified', e.target.value)}
            style={inputStyle}
          />
        </Field>

        {/* Save button (bottom) */}
        <button
          onClick={handleSave}
          style={{
            width: '100%',
            marginTop: 8,
            padding: '15px 0',
            borderRadius: 14,
            border: 'none',
            background: '#2F3437',
            fontSize: 16,
            fontWeight: 700,
            color: '#FFFFFF',
            cursor: 'pointer',
          }}
        >
          {isEditing ? 'Save Changes' : 'Add to Foundation'}
        </button>

        {isEditing && (
          <button
            onClick={onBack}
            style={{
              width: '100%',
              marginTop: 10,
              padding: '14px 0',
              borderRadius: 14,
              border: `1px solid ${colors.border}`,
              background: 'transparent',
              fontSize: 15,
              fontWeight: 600,
              color: colors.textSecondary,
              cursor: 'pointer',
            }}
          >
            Discard Changes
          </button>
        )}
      </div>
    </div>
  );
}
