let state = { at: null, running: false, updated: 0, error: false };
const listeners = new Set();

export function getSyncState() {
  return state;
}

export function setSyncState(patch) {
  state = { ...state, ...patch };
  listeners.forEach((listener) => listener(state));
}

export function subscribeSync(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}