// Carries a visitor's choice (a service, a calculator result) across pages,
// so the project brief can start pre-filled.
const KEY = 'bws-intent';
let memory = null;

export function setIntent(patch) {
  memory = { ...(peekIntent() || {}), ...patch };
  try {
    sessionStorage.setItem(KEY, JSON.stringify(memory));
  } catch {
    /* storage can be unavailable */
  }
}

export function peekIntent() {
  if (memory) return memory;
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearIntent(...keys) {
  const current = peekIntent();
  if (!current) return;
  if (keys.length === 0) {
    memory = null;
  } else {
    memory = { ...current };
    keys.forEach((k) => delete memory[k]);
  }
  try {
    if (memory && Object.keys(memory).length) sessionStorage.setItem(KEY, JSON.stringify(memory));
    else sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
  if (memory && Object.keys(memory).length === 0) memory = null;
}
