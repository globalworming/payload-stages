import * as migration_20251107_143600 from './20251107_143600';

export const migrations = [
  {
    up: migration_20251107_143600.up,
    down: migration_20251107_143600.down,
    name: '20251107_143600'
  },
];
