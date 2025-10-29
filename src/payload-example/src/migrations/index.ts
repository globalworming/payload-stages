import * as migration_20251029_125157 from './20251029_125157';
import * as migration_20251029_144400 from './20251029_144400';

export const migrations = [
  {
    up: migration_20251029_125157.up,
    down: migration_20251029_125157.down,
    name: '20251029_125157',
  },
  {
    up: migration_20251029_144400.up,
    down: migration_20251029_144400.down,
    name: '20251029_144400'
  },
];
