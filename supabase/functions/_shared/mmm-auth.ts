/**
 * MMM Shared Auth Middleware — supabase/functions/_shared/mmm-auth.ts
 *
 * Wave B2 — Core API: Authentication, Health, Organisation, and Invitations
 * Issue: maturion-isms#1428
 * Builder: api-builder
 * Date: 2026-04-21
 *
 * Provides:
 *   - validateJWT: Validates Bearer JWT from Authorization header; returns { userId, orgId, role }
 *   - requireRole:  Throws HTTP 403 if caller's role is not in allowedRoles (NBR-002 enforcement)
 *
 * NBR-002: ADMIN-only operations MUST return HTTP 403 (not 500 or silent failure) when the
 *   caller lacks the required role. All callers of requireRole rely on this contract.
 */

// NOTE: SupabaseClient type import — Deno/ESM compatible
// deno-lint-ignore-file no-explicit-any

/** Resolved claims from a validated JWT */
export interface JwtClaims {
  userId: string;
  orgId: string;
  role: string;
}

/**
 * Validates the Bearer JWT in the Authorization header using the Supabase admin client.
 *
 * Returns the resolved { userId, orgId, role } from the JWT + mmm_profiles table.
 * Throws a Response with HTTP 401 if the token is absent or invalid.
 * Throws a Response with HTTP 403 if the user has no mmm_profiles record.
 *
 * @param req      Incoming Request (reads Authorization header)
 * @param supabase Supabase client initialised with the service-role key (for profile lookup)
 */
export async function validateJWT(
  req: Request,
  supabase: any,
): Promise<JwtClaims> {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new Response(
      JSON.stringify({ error: 'Missing or malformed Authorization header' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const token = authHeader.replace('Bearer ', '').trim();

  // Verify the JWT via Supabase auth.getUser (validates signature + expiry)
  const { data: userData, error: authError } = await supabase.auth.getUser(token);
  if (authError || !userData?.user) {
    throw new Response(
      JSON.stringify({ error: 'Invalid or expired JWT' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } },
    );
  }

  const userId = userData.user.id;

  // Fetch org membership and role from mmm_profiles
  const { data: profile, error: profileError } = await supabase
    .from('mmm_profiles')
    .select('organisation_id, role')
    .eq('user_id', userId)
    .maybeSingle();

  if (profileError || !profile) {
    throw new Response(
      JSON.stringify({ error: 'No profile found for authenticated user' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    );
  }

  return {
    userId,
    orgId: profile.organisation_id as string,
    role: profile.role as string,
  };
}

/**
 * Role guard — throws HTTP 403 Response if `role` is not in `allowedRoles`.
 *
 * NBR-002: MUST return HTTP 403 (not 500, not silent failure) for insufficient scope.
 *
 * @param role         Caller's current role (from validateJWT)
 * @param allowedRoles Array of roles that may perform the operation
 */
export function requireRole(role: string, allowedRoles: string[]): void {
  if (!allowedRoles.includes(role)) {
    // NBR-002: explicit 403 — never 500 or silent
    throw new Response(
      JSON.stringify({
        error: 'Insufficient role',
        required: allowedRoles,
        actual: role,
      }),
      { status: 403, headers: { 'Content-Type': 'application/json' } },
    );
  }
}

/** Convenience: build a JSON Response */
export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Convenience: build a CORS-preflight response for OPTIONS requests */
export function corsHeaders(): Headers {
  const h = new Headers();
  h.set('Access-Control-Allow-Origin', '*');
  h.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  h.set('Access-Control-Allow-Headers', 'Authorization, Content-Type');
  return h;
}
