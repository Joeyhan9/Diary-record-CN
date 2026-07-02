import { isAuthenticated } from './auth-state.js';

/** @returns {boolean} */
export function canSaveData() {
  return isAuthenticated();
}

/**
 * @param {(path: string) => void} navigate
 * @param {string} [returnPath]
 */
export function redirectToLogin(navigate, returnPath = '/') {
  const encoded = encodeURIComponent(returnPath);
  navigate(`/login?redirect=${encoded}`);
}

/**
 * @param {(path: string) => void} navigate
 * @param {string} [returnPath]
 * @returns {boolean} true if user may proceed
 */
export function requireAuthForSave(navigate, returnPath) {
  if (canSaveData()) return true;
  redirectToLogin(navigate, returnPath || window.location.hash.slice(1) || '/');
  return false;
}
