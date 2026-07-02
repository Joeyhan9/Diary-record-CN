/** @typedef {import('@supabase/supabase-js').Session | null} Session */

/** @type {Session} */
let currentSession = null;

/** @type {Set<(session: Session) => void>} */
const listeners = new Set();

/** @returns {Session} */
export function getAuthSession() {
  return currentSession;
}

/** @returns {import('@supabase/supabase-js').User | null} */
export function getAuthUser() {
  return currentSession?.user ?? null;
}

/** @returns {boolean} */
export function isAuthenticated() {
  return Boolean(currentSession?.user);
}

/** @param {Session} session */
export function setAuthSession(session) {
  currentSession = session;
  listeners.forEach((fn) => fn(session));
}

/** @param {(session: Session) => void} listener */
export function subscribeAuth(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
