// Date utilities for Foundation

function parseDate(dateStr) {
  if (!dateStr) return null;
  // Use noon UTC to avoid timezone-shift issues
  return new Date(dateStr + 'T12:00:00');
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const target = parseDate(dateStr);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.ceil((target - today) / (1000 * 60 * 60 * 24));
}

export function daysSince(dateStr) {
  if (!dateStr) return null;
  const target = parseDate(dateStr);
  const today = new Date();
  today.setHours(12, 0, 0, 0);
  return Math.floor((today - target) / (1000 * 60 * 60 * 24));
}

export function formatDate(dateStr) {
  if (!dateStr) return null;
  const date = parseDate(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateInput(dateStr) {
  // Returns yyyy-mm-dd for <input type="date">
  if (!dateStr) return '';
  return dateStr.slice(0, 10);
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export function formatRelative(dateStr) {
  const days = daysUntil(dateStr);
  if (days === null) return null;
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Tomorrow';
  if (days < 14) return `${days} days`;
  if (days < 60) return `${Math.ceil(days / 7)}w`;
  if (days < 365) return `${Math.ceil(days / 30)}mo`;
  const yrs = Math.floor(days / 365);
  const mo = Math.ceil((days % 365) / 30);
  return mo > 0 ? `${yrs}y ${mo}mo` : `${yrs}y`;
}

export function formatRelativeLong(dateStr) {
  const days = daysUntil(dateStr);
  if (days === null) return null;
  if (days < 0) return `${Math.abs(days)} days overdue`;
  if (days === 0) return 'Due today';
  if (days === 1) return 'Tomorrow';
  if (days < 14) return `In ${days} days`;
  if (days < 60) {
    const w = Math.ceil(days / 7);
    return `In ${w} week${w > 1 ? 's' : ''}`;
  }
  if (days < 365) {
    const m = Math.ceil(days / 30);
    return `In ${m} month${m > 1 ? 's' : ''}`;
  }
  const y = Math.floor(days / 365);
  return `In ${y} year${y > 1 ? 's' : ''}`;
}

export function formatVerified(dateStr) {
  const days = daysSince(dateStr);
  if (days === null) return 'Never verified';
  if (days === 0) return 'Verified today';
  if (days === 1) return 'Verified yesterday';
  if (days < 7) return `Verified ${days} days ago`;
  if (days < 30) {
    const w = Math.floor(days / 7);
    return `Verified ${w} week${w > 1 ? 's' : ''} ago`;
  }
  if (days < 365) {
    const m = Math.floor(days / 30);
    return `Verified ${m} month${m > 1 ? 's' : ''} ago`;
  }
  return 'Verified over a year ago';
}
