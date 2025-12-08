// ===================================================================
// Maturion ISMS – Scoring Pipeline Job
// Computes criterion → MPS → domain → org scores
// Version: 1.0
// ===================================================================

import { serve } from "https://deno.land/x/sift@0.6.0/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const supabase = createClient(SUPABASE_URL!, SERVICE_KEY!);

// ================================================================
// Utility – weighted average
// ================================================================
function weightedAverage(values: { score: number; weight: number }[]) {
  const wSum = values.reduce((acc, v) => acc + v.weight, 0);
  if (wSum === 0) return 0;
  return values.reduce((acc, v) => acc + v.score * v.weight, 0) / wSum;
}

// ================================================================
// Main scoring engine logic
// ================================================================
serve(async (req) => {
  try {
    const { org_id, cycle_id } = await req.json();

    if (!org_id || !cycle_id) {
      return new Response("Missing org_id or cycle_id", { status: 400 });
    }

    // ------------------------------------------------------------
    // 1. Load maturity thresholds
    // ------------------------------------------------------------
    const { data: thresholds } = await supabase
      .from("maturity_score_thresholds")
      .select("*")
      .or(`org_id.eq.${org_id},org_id.is.null`);

    const getLevel = (score: number) => {
      const t = thresholds!.find(
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
    const { data: criteria } = await supabase
      .from("criteria")
      .select("id, mps_id, target_level")
      .eq("org_id", org_id);

    // ------------------------------------------------------------
    // 3. For each criterion, compute score
    // ------------------------------------------------------------
    for (const c of criteria!) {
      const { data: evidenceScores } = await supabase
        .from("evidence_ai_scores")
        .select("confidence")
        .eq("cycle_id", cycle_id)
        .eq("evidence_id", c.id);

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
    const { data: mps } = await supabase
      .from("mps")
      .select("id, domain_id, target_level")
      .eq("org_id", org_id);

    for (const m of mps!) {
      const { data: cs } = await supabase
        .from("criteria_scores")
        .select("numeric_score, criterion_id")
        .eq("cycle_id", cycle_id)
        .in(
          "criterion_id",
          criteria!.filter((c) => c.mps_id === m.id).map((c) => c.id)
        );

      const { data: weights } = await supabase
        .from("criteria_weights")
        .select("*");

      const items = cs!.map((entry) => ({
        score: entry.numeric_score,
        weight: weights!.find((w) => w.criterion_id === entry.criterion_id)
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
    const { data: domains } = await supabase
      .from("domains")
      .select("id, target_level")
      .eq("org_id", org_id);

    for (const d of domains!) {
      const { data: ms } = await supabase
        .from("mps_scores")
        .select("numeric_score, mps_id")
        .eq("cycle_id", cycle_id)
        .in(
          "mps_id",
          mps!.filter((x) => x.domain_id === d.id).map((x) => x.id)
        );

      const { data: weights } = await supabase
        .from("mps_weights")
        .select("*");

      const items = ms!.map((entry) => ({
        score: entry.numeric_score,
        weight: weights!.find((w) => w.mps_id === entry.mps_id)?.weight ?? 1,
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
      .eq("cycle_id", cycle_id);

    const { data: dWeights } = await supabase
      .from("domain_weights")
      .select("*");

    const orgItems = ds!.map((entry) => ({
      score: entry.numeric_score,
      weight: dWeights!.find((w) => w.domain_id === entry.domain_id)?.weight ??
        1,
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
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
    });
  }
});
