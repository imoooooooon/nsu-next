import test from 'node:test';
import assert from 'node:assert/strict';
import { loopPosition, withPromotionDemos } from '../src/shared/promotionModel.js';
import { publicRows } from '../src/shared/adminBridge.js';

test('carousel wraps forward and backward through identical end clones', () => {
  assert.deepEqual([0, 1, 2, 3, 4].map(p => loopPosition(p, 3)), [2, 0, 1, 2, 0]);
  assert.equal(loopPosition(1, 1), 0);
});

test('demo migration preserves admin decisions and remains removable and time bounded', () => {
  const now = Date.now();
  const existing = { id: 'existing', status: 'paused' };
  const original = { seededAt: new Date(now).toISOString(), members: [], campaigns: [existing] };
  const migrated = withPromotionDemos(original);
  assert.equal(original.campaigns.length, 1);
  assert.equal(migrated.campaigns[0], existing);
  assert.equal(publicRows('campaigns', [], migrated, now).length, 2);
  const paused = { ...migrated, campaigns: migrated.campaigns.map(ad => ({ ...ad, status: 'paused' })) };
  assert.equal(publicRows('campaigns', [], withPromotionDemos(paused), now).length, 0);
  const deleted = { ...migrated, campaigns: [] };
  assert.equal(withPromotionDemos(deleted), deleted);
  assert.equal(publicRows('campaigns', [], migrated, now + 91 * 86400000).length, 0);
});
