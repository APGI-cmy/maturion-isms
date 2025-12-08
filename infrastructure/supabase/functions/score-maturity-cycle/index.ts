// ===================================================================
// Maturion ISMS – Scoring Pipeline Job
// Computes criterion → MPS → domain → org scores
// Version: 1.0
// ===================================================================

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL!, SERVICE_KEY!);

// ================================================================
// Utility – weighted average
// ================================================================
function weightedAverage(values: { score: number; weight: number }[]) {
  if (!values || values.length === 0) return 0;
  const wSum = values.reduce((acc, v) => acc + v.weight, 0);
  if (wSum === 0) return 0;
  return values.reduce((acc, v) => acc + v.score * v.weight, 0) / wSum;
}

// ================================================================
// Main scoring engine logic
// ================================================================
Deno.serve(async (req) => {
  try {
    const { org_id, cycle_id } = await req.json();

    if (!org_id || !cycle_id) {
      return new Response("Missing org_id or cycle_id", { status: 400 });
    }

    // ------------------------------------------------------------
    // 1. Load maturity thresholds
    // ------------------------------------------------------------
    const { data: thresholds, error: thresholdsError } = await supabase
      .from("maturity_score_thresholds")
      .select("*")
      .or(`org_id.eq.${org_id},org_id.is.null`);

    if (thresholdsError || !thresholds) {
      return new Response(
        JSON.stringify({ error: `Failed to load thresholds: ${thresholdsError?.message}` }),
        { status: 500 }
      );
    }

    const getLevel = (score: number) => {
      const t = thresholds.find(
        (x) => score >= x.min_score && score <= x.max_score
      );
      if (t) return t.level;
      if (score <= 0) return 1;
      if (score >= 1) return 5;
      return 3;
    };

    // ------------------------------------------------------------
    // 2. Load all criteria in org
    // ------------------------------------------------------------
    const { data: criteria, error: criteriaError } = await supabase
      .from("criteria")
      .select("id, mps_id, target_level")
      .eq("org_id", org_id);

    if (criteriaError || !criteria) {
      return new Response(
        JSON.stringify({ error: `Failed to load criteria: ${criteriaError?.message}` }),
        { status: 500 }
      );
    }

    // ------------------------------------------------------------
    // 3. For each criterion, compute score
    // ------------------------------------------------------------
    // Load all evidence for these criteria once (performance optimization)
    const { data: allEvidence, error: evidenceError } = await supabase
      .from("evidence")
      .select("id, criteria_id")
      .in(
        "criteria_id",
        criteria.map((c) => c.id)
      );

    if (evidenceError) {
      return new Response(
        JSON.stringify({ error: `Failed to load evidence: ${evidenceError?.message}` }),
        { status: 500 }
      );
    }

    // Build a map of criteria to evidence IDs for efficient lookup
    const criteriaToEvidenceIds = new Map<string, string[]>();
    if (allEvidence) {
      for (const ev of allEvidence) {
        if (!criteriaToEvidenceIds.has(ev.criteria_id)) {
          criteriaToEvidenceIds.set(ev.criteria_id, []);
        }
        criteriaToEvidenceIds.get(ev.criteria_id)!.push(ev.id);
      }
    }

    for (const c of criteria) {
      const evidenceIds = criteriaToEvidenceIds.get(c.id) || [];
      
      let evidenceScores = null;
      if (evidenceIds.length > 0) {
        // Query evidence_ai_scores for this criterion's evidence
        const { data, error: scoresError } = await supabase
          .from("evidence_ai_scores")
          .select("confidence")
          .eq("cycle_id", cycle_id)
          .in("evidence_id", evidenceIds);

        if (scoresError) {
          return new Response(
            JSON.stringify({ error: `Failed to load evidence scores for criterion ${c.id}: ${scoresError?.message}` }),
            { status: 500 }
          );
        }
        evidenceScores = data;
      }

      if (!evidenceScores || evidenceScores.length === 0) {
        // Insert zero score
        await supabase.from("criteria_scores").upsert({
          criterion_id: c.id,
          cycle_id,
          numeric_score: 0,
          maturity_level: 1,
          target_level: c.target_level,
          gap: c.target_level - 1,
          evidence_count: 0,
          avg_evidence_confidence: 0,
        });
        continue;
      }

      const values = evidenceScores.map((e) => e.confidence);
      const avg = values.reduce((acc, v) => acc + v, 0) / values.length;
      const clamped = Math.max(0, Math.min(1, avg));
      const level = getLevel(clamped);

      await supabase.from("criteria_scores").upsert({
        criterion_id: c.id,
        cycle_id,
        numeric_score: clamped,
        maturity_level: level,
        target_level: c.target_level,
        gap: c.target_level - level,
        evidence_count: values.length,
        avg_evidence_confidence: avg,
      });
    }

    // ------------------------------------------------------------
    // 4. Score MPS
    // ------------------------------------------------------------
    const { data: mps, error: mpsError } = await supabase
      .from("mps")
      .select("id, domain_id, target_level")
      .eq("org_id", org_id);

    if (mpsError || !mps) {
      return new Response(
        JSON.stringify({ error: `Failed to load MPS: ${mpsError?.message}` }),
        { status: 500 }
      );
    }

    // Load all criteria weights once (performance optimization)
    const { data: allCriteriaWeights, error: criteriaWeightsError } = await supabase
      .from("criteria_weights")
      .select("*")
      .in(
        "criterion_id",
        criteria.map((c) => c.id)
      );

    if (criteriaWeightsError) {
      console.warn("Failed to load criteria weights, using default weight of 1.0:", criteriaWeightsError.message);
    }

    for (const m of mps) {
      const { data: cs } = await supabase
        .from("criteria_scores")
        .select("numeric_score, criterion_id")
        .eq("cycle_id", cycle_id)
        .in(
          "criterion_id",
          criteria.filter((c) => c.mps_id === m.id).map((c) => c.id)
        );

      if (!cs || cs.length === 0) continue;

      const items = cs.map((entry) => ({
        score: entry.numeric_score,
        weight: allCriteriaWeights?.find((w) => w.criterion_id === entry.criterion_id)
          ?.weight ?? 1,
      }));

      const score = weightedAverage(items);
      const level = getLevel(score);

      await supabase.from("mps_scores").upsert({
        mps_id: m.id,
        cycle_id,
        numeric_score: score,
        maturity_level: level,
        target_level: m.target_level,
        gap: m.target_level - level,
      });
    }

    // ------------------------------------------------------------
    // 5. Score Domains
    // ------------------------------------------------------------
    const { data: domains, error: domainsError } = await supabase
      .from("domains")
      .select("id, target_level")
      .eq("org_id", org_id);

    if (domainsError || !domains) {
      return new Response(
        JSON.stringify({ error: `Failed to load domains: ${domainsError?.message}` }),
        { status: 500 }
      );
    }

    // Load all MPS weights once (performance optimization)
    const { data: allMpsWeights, error: mpsWeightsError } = await supabase
      .from("mps_weights")
      .select("*")
      .in(
        "mps_id",
        mps.map((m) => m.id)
      );

    if (mpsWeightsError) {
      console.warn("Failed to load MPS weights, using default weight of 1.0:", mpsWeightsError.message);
    }

    for (const d of domains) {
      const { data: ms } = await supabase
        .from("mps_scores")
        .select("numeric_score, mps_id")
        .eq("cycle_id", cycle_id)
        .in(
          "mps_id",
          mps.filter((x) => x.domain_id === d.id).map((x) => x.id)
        );

      if (!ms || ms.length === 0) continue;

      const items = ms.map((entry) => ({
        score: entry.numeric_score,
        weight: allMpsWeights?.find((w) => w.mps_id === entry.mps_id)?.weight ?? 1,
      }));

      const score = weightedAverage(items);
      const level = getLevel(score);

      await supabase.from("domain_scores").upsert({
        domain_id: d.id,
        cycle_id,
        numeric_score: score,
        maturity_level: level,
        target_level: d.target_level,
        gap: d.target_level - level,
      });
    }

    // ------------------------------------------------------------
    // 6. Score entire organization
    // ------------------------------------------------------------
    const { data: ds } = await supabase
      .from("domain_scores")
      .select("domain_id, numeric_score")
      .eq("cycle_id", cycle_id)
      .in(
        "domain_id",
        domains.map((d) => d.id)
      );

    if (!ds || ds.length === 0) {
      return new Response(
        JSON.stringify({ error: "No domain scores found to compute organization score" }),
        { status: 500 }
      );
    }

    // Load all domain weights once (performance optimization)
    const { data: dWeights, error: domainWeightsError } = await supabase
      .from("domain_weights")
      .select("*")
      .in(
        "domain_id",
        domains.map((d) => d.id)
      );

    if (domainWeightsError) {
      console.warn("Failed to load domain weights, using default weight of 1.0:", domainWeightsError.message);
    }

    const orgItems = ds.map((entry) => ({
      score: entry.numeric_score,
      weight: dWeights?.find((w) => w.domain_id === entry.domain_id)?.weight ?? 1,
    }));

    const orgScore = weightedAverage(orgItems);
    const orgLevel = getLevel(orgScore);

    await supabase.from("organization_maturity_scores").upsert({
      org_id,
      cycle_id,
      numeric_score: orgScore,
      maturity_level: orgLevel,
    });

    return new Response(
      JSON.stringify({ message: "Scoring pipeline complete." }),
      { status: 200 }
    );
  } catch (err) {
    // Log error for debugging but return generic message for security
    console.error("Scoring pipeline error:", err);
    return new Response(
      JSON.stringify({ error: "An error occurred while processing the scoring pipeline" }),
      { status: 500 }
    );
  }
});
