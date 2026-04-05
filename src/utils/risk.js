// Risk computation engine for Foundation

import { daysUntil, daysSince } from './dates';

// Compute dynamic risk level for a single item
export function computeRiskLevel(item) {
  const dateStr = item.expirationDate || item.dueDate;

  // Recurring bills: use staleness only
  if (item.isRecurring) {
    const stale = daysSince(item.lastVerified);
    if (stale !== null && stale > 365) return 'watch';
    return 'stable';
  }

  // Reference items without dates: use staleness
  if (!dateStr) {
    if (item.category === 'references') {
      const stale = daysSince(item.lastVerified);
      if (stale !== null && stale > 730) return 'watch';
      return 'stable';
    }
    // For other items with no date, check staleness
    const stale = daysSince(item.lastVerified);
    if (stale !== null && stale > 365) return 'watch';
    return 'stable';
  }

  const days = daysUntil(dateStr);

  // Overdue
  if (days < 0) return 'critical';

  // Hard urgency thresholds
  if (days <= 14) return 'critical';
  if (days <= 45) return 'action-needed';

  // Within item's own reminder window → watch
  const leadTime = item.reminderLeadTime ?? 60;
  if (days <= leadTime) return 'watch';

  // Stale verification can bump up to watch even if date is far out
  const stale = daysSince(item.lastVerified);
  if (stale !== null && stale > 365) return 'watch';

  return 'stable';
}

// Add computed riskLevel to each item
export function enrichItems(items) {
  return items.map((item) => ({
    ...item,
    riskLevel: computeRiskLevel(item),
  }));
}

// Compute the overall dashboard status from an array of enriched items
export function computeOverallStatus(items) {
  const levels = items.map((i) => i.riskLevel);
  if (levels.includes('critical')) return 'critical';
  if (levels.includes('action-needed')) return 'action-needed';
  if (levels.includes('watch')) return 'watch';
  return 'stable';
}

// Items needing immediate attention
export function getImmediateItems(items) {
  return items
    .filter((i) => i.riskLevel === 'critical' || i.riskLevel === 'action-needed')
    .sort((a, b) => {
      const aDate = a.expirationDate || a.dueDate;
      const bDate = b.expirationDate || b.dueDate;
      if (!aDate && !bDate) return 0;
      if (!aDate) return 1;
      if (!bDate) return -1;
      return new Date(aDate) - new Date(bDate);
    });
}

// Items expiring within the next N days
export function getUpcomingItems(items, withinDays = 365) {
  return items
    .filter((i) => {
      if (i.isRecurring) return false;
      const dateStr = i.expirationDate || i.dueDate;
      if (!dateStr) return false;
      const days = daysUntil(dateStr);
      return days !== null && days >= 0 && days <= withinDays;
    })
    .sort((a, b) => {
      const aDate = a.expirationDate || a.dueDate;
      const bDate = b.expirationDate || b.dueDate;
      return new Date(aDate) - new Date(bDate);
    });
}

// Recently verified (within N days)
export function getRecentlyVerified(items, withinDays = 30) {
  return items
    .filter((i) => {
      if (!i.lastVerified) return false;
      const stale = daysSince(i.lastVerified);
      return stale !== null && stale <= withinDays;
    })
    .sort((a, b) => new Date(b.lastVerified) - new Date(a.lastVerified));
}

// Group items by category, return summary
export function getCategoryGroups(items, categoryMeta) {
  return Object.entries(categoryMeta).map(([key, meta]) => {
    const catItems = items.filter((i) => i.category === key);
    const stableCount = catItems.filter((i) => i.riskLevel === 'stable').length;
    const worstLevel = computeOverallStatus(catItems);
    return {
      key,
      meta,
      items: catItems,
      count: catItems.length,
      stableCount,
      worstLevel,
    };
  });
}
