// Deliberately snapshot only literal fixture arrays, never execute application modules.
// Re-run explicitly when public fixtures change; operational state is never overwritten.
import { readFileSync, writeFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
const extract = (path, name) => {
  const source = readFileSync(path, 'utf8');
  const start = source.indexOf(`const ${name} = `);
  if (start < 0) throw new Error(`Missing ${name}`);
  const body = source.slice(start + `const ${name} = `.length);
  return runInNewContext(`(${body.slice(0, body.indexOf('\n];') + 2)})`, Object.create(null), { timeout: 1000 });
};
const peoplePath = 'webapp/src/data/people.js';
const snapshot = {
  members: ['Alumni', 'Faculty', 'Student'].flatMap(role => extract(peoplePath, `global${role}Data`).map(p => ({ ...p, identity: role }))),
  departments: extract('webapp/src/data/departments.js', 'globalDepartments'),
  seeking: extract('webapp/src/features/seeking/data.js', 'globalSeekingData'),
  events: extract('webapp/src/data/events.js', 'seedEventsData'),
  requests: extract('webapp/src/data/emergency.js', 'globalEmergencyRequests'),
  hiring: extract('webapp/src/data/jobs.js', 'globalJobsData'),
};
writeFileSync('nsunext-admin/src/data/product-snapshot.json', JSON.stringify(snapshot, null, 2) + '\n');
