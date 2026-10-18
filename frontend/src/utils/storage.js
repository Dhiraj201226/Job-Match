/**
 * LocalStorage manager for Saved Jobs & Comparison Ranking
 */

const STORAGE_KEY = 'jobmatch_saved_jobs';
const USAGE_KEY = 'jobmatch_usage_count';
const MAX_FREE_MATCHES = 3;

export function getSavedJobs() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw);
    if (!Array.isArray(list)) return [];
    // Always sort descending by match_score
    return list.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));
  } catch {
    return [];
  }
}

export function saveJobMatch(item) {
  try {
    const current = getSavedJobs();
    const id = item.id || `job_${Date.now()}`;
    const newItem = {
      ...item,
      id,
      savedAt: item.savedAt || new Date().toISOString()
    };

    // Filter out if duplicate ID exists, then prepend
    const updated = [newItem, ...current.filter(j => j.id !== id)];
    // Sort descending by score
    updated.sort((a, b) => (b.match_score || 0) - (a.match_score || 0));

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('savedJobsUpdated'));
    return newItem;
  } catch (err) {
    console.error('Failed to save job:', err);
    return null;
  }
}

export function deleteSavedJob(id) {
  try {
    const current = getSavedJobs();
    const updated = current.filter(j => j.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('savedJobsUpdated'));
    return updated;
  } catch {
    return [];
  }
}

export function clearAllSavedJobs() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('savedJobsUpdated'));
  } catch {}
}

export function getUsageCount() {
  try {
    const val = localStorage.getItem(USAGE_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

export function incrementUsageCount() {
  try {
    const current = getUsageCount();
    const next = current + 1;
    localStorage.setItem(USAGE_KEY, next.toString());
    return next;
  } catch {
    return 1;
  }
}

export { MAX_FREE_MATCHES };
