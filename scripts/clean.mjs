import { rm } from 'node:fs/promises';

for (const target of ['dist', 'coverage']) {
  try {
    await rm(target, { force: true, recursive: true });
  } catch {
    // Ignore missing paths so clean stays idempotent.
  }
}
