const requiredRoutes = [
  '/',
  '/modules',
  '/journey',
  '/free-assessment',
  '/subscribe',
  '/subscribe/checkout',
  '/auth',
  '/onboarding',
  '/dashboard',
  '/assessment',
  '/maturity/setup',
  '/modules/maturity-roadmap',
  '/modules/risk-management',
  '/modules/project-implementation',
  '/modules/data-analytics',
  '/modules/systems-integration',
  '/modules/skills-development',
  '/modules/incident-intelligence',
];

const protectedRoutes = new Set(['/onboarding', '/dashboard', '/assessment', '/maturity/setup']);
const marketingRoutes = requiredRoutes.filter((route) => route.startsWith('/modules/'));

if (requiredRoutes.length !== new Set(requiredRoutes).size) {
  throw new Error('Duplicate route found in W7 route verification list.');
}

if (!requiredRoutes.includes('/maturity/setup')) {
  throw new Error('W7 route verification must include private maturity setup handoff route.');
}

if (!protectedRoutes.has('/dashboard') || !protectedRoutes.has('/maturity/setup')) {
  throw new Error('Protected route verification list is incomplete.');
}

if (marketingRoutes.length < 7) {
  throw new Error('Expected canonical marketing routes are missing from route verification list.');
}

console.log(`ISMS W7 route verification passed for ${requiredRoutes.length} routes.`);
console.log(`Protected route count: ${protectedRoutes.size}.`);
console.log(`Canonical marketing route count: ${marketingRoutes.length}.`);
