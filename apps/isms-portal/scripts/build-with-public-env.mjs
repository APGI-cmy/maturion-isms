import { spawnSync } from 'node:child_process';

const command = process.platform === 'win32' ? 'pnpm.cmd' : 'pnpm';
const env = {
  ...process.env,
  VITE_SUPABASE_URL:
    process.env.VITE_SUPABASE_URL || 'https://ujucvyyspfxlxlfdamda.supabase.co',
  VITE_SUPABASE_PUBLISHABLE_KEY:
    process.env.VITE_SUPABASE_PUBLISHABLE_KEY ||
    'sb_publishable_ZUKVt9ixujFGVpI3JVzGEw_MIQYm2np',
};

function run(args) {
  const result = spawnSync(command, args, {
    cwd: process.cwd(),
    env,
    stdio: 'inherit',
  });

  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}

run(['exec', 'tsc']);
run(['exec', 'vite', 'build']);
