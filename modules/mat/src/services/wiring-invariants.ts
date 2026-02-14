/**
 * System Wiring Invariants Service
 * Architecture: modules/mat/02-architecture/system-architecture.md §3.11
 */

import type { SystemComponent, SystemConnection, StartupDependency } from '../types/index.js';

/**
 * System components as defined in architecture §3.11.1
 */
export const SYSTEM_COMPONENTS: SystemComponent[] = [
  {
    id: 'frontend',
    name: 'Frontend',
    type: 'frontend',
    technology: 'React + TypeScript',
    description: 'Single-page application with offline-first architecture'
  },
  {
    id: 'supabase-auth',
    name: 'Supabase Auth',
    type: 'backend',
    technology: 'Supabase Auth',
    description: 'Authentication and authorization service'
  },
  {
    id: 'postgrest',
    name: 'PostgREST + RLS',
    type: 'database',
    technology: 'PostgREST + PostgreSQL RLS',
    description: 'RESTful API layer with row-level security'
  },
  {
    id: 'realtime',
    name: 'Realtime',
    type: 'backend',
    technology: 'Supabase Realtime',
    description: 'WebSocket-based real-time subscriptions'
  },
  {
    id: 'storage',
    name: 'Storage',
    type: 'backend',
    technology: 'Supabase Storage',
    description: 'File storage service'
  },
  {
    id: 'edge-functions',
    name: 'Edge Functions',
    type: 'backend',
    technology: 'Deno',
    description: 'Serverless edge functions'
  },
  {
    id: 'ai-gateway',
    name: 'AI Gateway',
    type: 'backend',
    technology: 'FastAPI',
    description: 'AI orchestration and gateway service'
  },
  {
    id: 'ai-services',
    name: 'AI Services',
    type: 'backend',
    technology: 'Python',
    description: 'AI processing services'
  },
  {
    id: 'openai-api',
    name: 'OpenAI API',
    type: 'external',
    technology: 'OpenAI',
    description: 'External OpenAI API service'
  },
  {
    id: 'service-worker',
    name: 'Service Worker',
    type: 'worker',
    technology: 'Service Worker + IndexedDB',
    description: 'Offline sync and caching'
  }
];

/**
 * System connections as defined in architecture §3.11.2
 */
export const SYSTEM_CONNECTIONS: SystemConnection[] = [
  {
    id: 'A',
    label: 'Frontend ↔ Supabase Auth',
    source: 'frontend',
    target: 'supabase-auth',
    protocol: 'HTTPS/JWT',
    direction: 'bidirectional',
    failure_isolation: true
  },
  {
    id: 'B',
    label: 'Frontend ↔ PostgREST',
    source: 'frontend',
    target: 'postgrest',
    protocol: 'HTTPS/REST',
    direction: 'bidirectional',
    failure_isolation: true
  },
  {
    id: 'C',
    label: 'PostgREST → Frontend',
    source: 'realtime',
    target: 'frontend',
    protocol: 'WSS',
    direction: 'unidirectional',
    failure_isolation: true
  },
  {
    id: 'D',
    label: 'Frontend ↔ Storage',
    source: 'frontend',
    target: 'storage',
    protocol: 'HTTPS',
    direction: 'bidirectional',
    failure_isolation: true
  },
  {
    id: 'E',
    label: 'Frontend ↔ Edge Functions',
    source: 'frontend',
    target: 'edge-functions',
    protocol: 'HTTPS',
    direction: 'bidirectional',
    failure_isolation: true
  },
  {
    id: 'F',
    label: 'Frontend ↔ Service Worker',
    source: 'frontend',
    target: 'service-worker',
    protocol: 'ServiceWorker API',
    direction: 'bidirectional',
    failure_isolation: true
  },
  {
    id: 'G',
    label: 'Edge Functions ↔ AI Gateway',
    source: 'edge-functions',
    target: 'ai-gateway',
    protocol: 'HTTPS',
    direction: 'bidirectional',
    failure_isolation: true
  },
  {
    id: 'H',
    label: 'AI Gateway ↔ PostgREST',
    source: 'ai-gateway',
    target: 'postgrest',
    protocol: 'HTTPS/REST',
    direction: 'bidirectional',
    failure_isolation: true
  },
  {
    id: 'K',
    label: 'AI Services ↔ OpenAI API',
    source: 'ai-services',
    target: 'openai-api',
    protocol: 'HTTPS',
    direction: 'bidirectional',
    failure_isolation: true
  },
  {
    id: 'L',
    label: 'Service Worker ↔ PostgREST',
    source: 'service-worker',
    target: 'postgrest',
    protocol: 'HTTPS/REST',
    direction: 'bidirectional',
    failure_isolation: true
  }
];

/**
 * Startup dependencies as defined in architecture §3.11.3
 */
export const STARTUP_DEPENDENCIES: StartupDependency[] = [
  { component: 'postgrest', depends_on: [], order: 1 },
  { component: 'service-worker', depends_on: [], order: 1 },
  { component: 'supabase-auth', depends_on: ['postgrest'], order: 2 },
  { component: 'storage', depends_on: ['postgrest'], order: 2 },
  { component: 'realtime', depends_on: ['postgrest'], order: 3 },
  { component: 'edge-functions', depends_on: ['postgrest', 'supabase-auth'], order: 3 },
  { component: 'ai-gateway', depends_on: ['edge-functions'], order: 4 },
  { component: 'ai-services', depends_on: ['ai-gateway'], order: 5 },
  { component: 'frontend', depends_on: ['supabase-auth', 'postgrest', 'storage'], order: 6 }
];

/**
 * Validates that no components are orphaned (Invariant 1)
 * Every component must have at least one connection
 */
export function validateNoOrphanComponents(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const connectedComponents = new Set<string>();

  // Collect all components referenced in connections
  for (const connection of SYSTEM_CONNECTIONS) {
    connectedComponents.add(connection.source);
    connectedComponents.add(connection.target);
  }

  // Check each component
  for (const component of SYSTEM_COMPONENTS) {
    if (!connectedComponents.has(component.id)) {
      errors.push(`Component '${component.id}' is orphaned (no connections)`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates that no phantom interfaces exist (Invariant 2)
 * All connection endpoints must reference real components
 */
export function validateNoPhantomInterfaces(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const componentIds = new Set(SYSTEM_COMPONENTS.map(c => c.id));

  for (const connection of SYSTEM_CONNECTIONS) {
    if (!componentIds.has(connection.source)) {
      errors.push(`Connection '${connection.id}' references phantom source '${connection.source}'`);
    }
    if (!componentIds.has(connection.target)) {
      errors.push(`Connection '${connection.id}' references phantom target '${connection.target}'`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates that no implicit connections exist (Invariant 3)
 * All connections must have explicit protocol, source, target, and label
 */
export function validateNoImplicitConnections(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const connection of SYSTEM_CONNECTIONS) {
    if (!connection.protocol || connection.protocol.trim() === '') {
      errors.push(`Connection '${connection.id}' missing protocol`);
    }
    if (!connection.source || connection.source.trim() === '') {
      errors.push(`Connection '${connection.id}' missing source`);
    }
    if (!connection.target || connection.target.trim() === '') {
      errors.push(`Connection '${connection.id}' missing target`);
    }
    if (!connection.label || connection.label.trim() === '') {
      errors.push(`Connection '${connection.id}' missing label`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates directional clarity (Invariant 4)
 * All connections must declare direction (unidirectional or bidirectional)
 */
export function validateDirectionalClarity(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const connection of SYSTEM_CONNECTIONS) {
    if (!connection.direction || (connection.direction !== 'unidirectional' && connection.direction !== 'bidirectional')) {
      errors.push(`Connection '${connection.id}' missing or invalid direction`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates failure isolation (Invariant 5)
 * All connections must have failure isolation configured
 */
export function validateFailureIsolation(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  for (const connection of SYSTEM_CONNECTIONS) {
    if (typeof connection.failure_isolation !== 'boolean') {
      errors.push(`Connection '${connection.id}' missing failure_isolation configuration`);
    }
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates a specific connection
 */
export function validateConnection(
  connectionId: string,
  expectedSource: string,
  expectedTarget: string,
  expectedProtocol: string,
  expectedDirection: 'unidirectional' | 'bidirectional'
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const connection = SYSTEM_CONNECTIONS.find(c => c.id === connectionId);

  if (!connection) {
    errors.push(`Connection '${connectionId}' not found`);
    return { valid: false, errors };
  }

  if (connection.source !== expectedSource) {
    errors.push(`Connection '${connectionId}' source mismatch: expected '${expectedSource}', got '${connection.source}'`);
  }

  if (connection.target !== expectedTarget) {
    errors.push(`Connection '${connectionId}' target mismatch: expected '${expectedTarget}', got '${connection.target}'`);
  }

  if (connection.protocol !== expectedProtocol) {
    errors.push(`Connection '${connectionId}' protocol mismatch: expected '${expectedProtocol}', got '${connection.protocol}'`);
  }

  if (connection.direction !== expectedDirection) {
    errors.push(`Connection '${connectionId}' direction mismatch: expected '${expectedDirection}', got '${connection.direction}'`);
  }

  if (!connection.failure_isolation) {
    errors.push(`Connection '${connectionId}' failure_isolation not enabled`);
  }

  return { valid: errors.length === 0, errors };
}

/**
 * Validates startup order compliance
 * Ensures dependencies are acyclic and ordered correctly
 */
export function validateStartupOrderCompliance(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const componentOrders = new Map<string, number>();

  // Build order map
  for (const dep of STARTUP_DEPENDENCIES) {
    componentOrders.set(dep.component, dep.order);
  }

  // Check that all components have dependencies defined
  const componentsWithDeps = new Set(STARTUP_DEPENDENCIES.map(d => d.component));
  for (const component of SYSTEM_COMPONENTS) {
    // External components (like openai-api) may not have startup dependencies
    if (component.type !== 'external' && !componentsWithDeps.has(component.id)) {
      errors.push(`Component '${component.id}' missing startup dependency definition`);
    }
  }

  // Check dependency ordering
  for (const dep of STARTUP_DEPENDENCIES) {
    const componentOrder = dep.order;

    for (const dependency of dep.depends_on) {
      const dependencyOrder = componentOrders.get(dependency);

      if (dependencyOrder === undefined) {
        errors.push(`Component '${dep.component}' depends on undefined component '${dependency}'`);
        continue;
      }

      if (dependencyOrder >= componentOrder) {
        errors.push(`Component '${dep.component}' (order ${componentOrder}) depends on '${dependency}' (order ${dependencyOrder}) - invalid ordering`);
      }
    }
  }

  // Check for cycles (simple check - in a proper implementation would use DFS)
  const visited = new Set<string>();
  const recursionStack = new Set<string>();

  function hasCycle(component: string): boolean {
    if (recursionStack.has(component)) {
      return true;
    }
    if (visited.has(component)) {
      return false;
    }

    visited.add(component);
    recursionStack.add(component);

    const dep = STARTUP_DEPENDENCIES.find(d => d.component === component);
    if (dep) {
      for (const dependency of dep.depends_on) {
        if (hasCycle(dependency)) {
          return true;
        }
      }
    }

    recursionStack.delete(component);
    return false;
  }

  for (const dep of STARTUP_DEPENDENCIES) {
    if (hasCycle(dep.component)) {
      errors.push(`Cyclic dependency detected involving '${dep.component}'`);
      break;
    }
  }

  return { valid: errors.length === 0, errors };
}
