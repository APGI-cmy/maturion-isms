# Private Course Creator runtime

This is the Python/FastAPI adapter for the governed Course Creator specialist.
It exposes `POST /api/v1/course-creator/delegate`, separately from APW public chat.

The initial commissioning scope is **read-only inspection and independent evaluation**.
It does not replace the existing manual producer or learner-guide QA suite, run a
course job, approve a manual, extend correction loops, or release LU2.

The app controller selects current evidence and retained counters. A registered
Ed25519 controller key binds the exact request, route and a 60-second timestamp.
Database registration additionally binds subscriber, user, project and unit.
Only server-role database access is granted; browsers never receive signing keys.

The durable claim transaction serialises reservations, limits total requests to
40 per UTC day (two model calls each), and prevents duplicate dispatch. A completed
request returns its saved result. An uncertain outcome remains held, consuming its
allowance. There are no automatic provider retries, refunds or retry loops.

The first real model call executes the hash-verified Tier 1/Tier 2 specialist
against the supplied Tier 3 job context. A separate Maturion model call checks
and synthesises its response against the same evidence. Structured validation
rejects unknown evidence references. Neither output is a course QA pass.

`runtime-schema.sql` is the reproducible schema source for the server-only
registration and request ledger. A registration begins disabled with a bounded
commissioning permission. Activation requires independently accepted exact-source
and real runtime evidence; an ordinary status flag is not a signed agent-bundle
activation receipt. Full agent activation retains the separate bundle preflight.

Runtime knowledge is copied byte-for-byte from the independently reviewed portable
bundle. Its scoped `.gitattributes` preserves those bytes on Windows. Do not edit
the copied contract or knowledge to bypass its authorised factory route.
