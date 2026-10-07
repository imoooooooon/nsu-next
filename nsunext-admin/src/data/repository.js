import { mergeSubmissions, readSubmissions } from '../../../src/shared/adminBridge.js';
import { migratePhase3 } from './phase3.js';
import { transition } from '../lib/model.js';
export const STORE_KEY = 'ugrads-admin-data-v1';
export function validateStored(value) {
  if (!value || ![1, 2].includes(value.version) || !Number.isInteger(value.revision) || !['members', 'departments', 'verification', 'claims', 'hiring', 'seeking', 'admins', 'audit'].every(key => Array.isArray(value[key]))) throw new Error('Stored admin data is incompatible or damaged. Restore a valid backup before continuing.');
  for (const key of ['members', 'departments', 'verification', 'claims', 'hiring', 'seeking']) {
    if (!value[key].every(row => typeof row.id === 'string' && Number.isInteger(row.revision))) throw new Error(`Stored ${key} data is invalid.`);
  }
  const migrated = migratePhase3(value);
  for (const key of ['events', 'requests', 'donors', 'moderation', 'campaigns', 'settings', 'restrictions']) if (!Array.isArray(migrated[key])) throw new Error(`Stored ${key} data is invalid.`);
  return migrated;
}
export function createRepository(storage, seed) {
  const read = () => { const raw = storage.getItem(STORE_KEY); return raw ? mergeSubmissions(validateStored(JSON.parse(raw)), readSubmissions(storage)) : null; };
  return {
    load() { const current = read(); if (current) { if (storage.getItem(STORE_KEY) !== JSON.stringify(current)) storage.setItem(STORE_KEY, JSON.stringify(current)); return current; } const initial = mergeSubmissions(seed(), readSubmissions(storage)); storage.setItem(STORE_KEY, JSON.stringify(initial)); return initial; },
    commit(actorId, command) {
      const current = read();
      if (!current) throw new Error('The workspace was cleared. Reload before making a decision.');
      const next = transition(current, actorId, command);
      storage.setItem(STORE_KEY, JSON.stringify(next));
      return next;
    },
  };
}
