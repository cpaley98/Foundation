// Foundation Design Tokens

export const colors = {
  // Page
  pageBg: '#F3F2EF',
  surface: '#FFFFFF',
  surfaceHover: '#F9F8F6',
  border: '#E5E3DE',
  borderLight: '#EFEDE9',

  // Typography
  textPrimary: '#1A1917',
  textSecondary: '#6B6560',
  textTertiary: '#9C9893',
  textInverse: '#FFFFFF',

  // Brand
  charcoal: '#2F3437',
  charcoalLight: '#3D4447',

  // Status — Stable
  stableDot: '#22C55E',
  stableText: '#15803D',
  stableBg: '#F0FDF4',
  stableBorder: '#BBF7D0',

  // Status — Watch
  watchDot: '#EAB308',
  watchText: '#A16207',
  watchBg: '#FEFCE8',
  watchBorder: '#FDE68A',

  // Status — Action Needed
  actionDot: '#F97316',
  actionText: '#C2410C',
  actionBg: '#FFF7ED',
  actionBorder: '#FED7AA',

  // Status — Critical
  criticalDot: '#F43F5E',
  criticalText: '#9F1239',
  criticalBg: '#FFF1F2',
  criticalBorder: '#FECDD3',
};

export const risk = {
  stable: {
    label: 'Stable',
    dot: colors.stableDot,
    text: colors.stableText,
    bg: colors.stableBg,
    border: colors.stableBorder,
  },
  watch: {
    label: 'Watch',
    dot: colors.watchDot,
    text: colors.watchText,
    bg: colors.watchBg,
    border: colors.watchBorder,
  },
  'action-needed': {
    label: 'Action Needed',
    dot: colors.actionDot,
    text: colors.actionText,
    bg: colors.actionBg,
    border: colors.actionBorder,
  },
  critical: {
    label: 'Critical',
    dot: colors.criticalDot,
    text: colors.criticalText,
    bg: colors.criticalBg,
    border: colors.criticalBorder,
  },
};

export const overallStatus = {
  stable: {
    label: 'Foundation Stable',
    subtitle: 'All systems are current and accounted for.',
    heroBg: '#2F3437',
  },
  watch: {
    label: 'Watch',
    subtitle: 'A few items are approaching renewal.',
    heroBg: '#2F3437',
  },
  'action-needed': {
    label: 'Action Needed',
    subtitle: 'Some items need your attention soon.',
    heroBg: '#2F3437',
  },
  critical: {
    label: 'Critical',
    subtitle: 'Immediate attention required.',
    heroBg: '#1A0E0E',
  },
};

export const categoryMeta = {
  coverage: {
    label: 'Coverage',
    icon: 'shield',
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  expirations: {
    label: 'Expirations',
    icon: 'calendar',
    color: '#7C3AED',
    bg: '#F5F3FF',
  },
  professional: {
    label: 'Professional',
    icon: 'briefcase',
    color: '#0891B2',
    bg: '#ECFEFF',
  },
  references: {
    label: 'References',
    icon: 'bookmark',
    color: '#9333EA',
    bg: '#FAF5FF',
  },
};

export const spacing = {
  pagePad: 16,
  cardPad: 18,
  gap: 12,
  sectionGap: 28,
  borderRadius: 18,
  borderRadiusSm: 12,
  borderRadiusXs: 8,
};
