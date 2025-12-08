import { describe, it, expect } from "vitest";
import {
  computeEvidenceConfidence,
  computeCriterionScore,
  computeMpsScore,
  computeDomainScore,
  computeOrganizationMaturity,
  getMaturityLevel
} from "../lib/scoring";

const thresholds = [
  { level: 1, minScore: 0.0, maxScore: 0.19 },
  { level: 2, minScore: 0.2, maxScore: 0.39 },
  { level: 3, minScore: 0.4, maxScore: 0.59 },
  { level: 4, minScore: 0.6, maxScore: 0.79 },
  { level: 5, minScore: 0.8, maxScore: 1.0 },
];

describe("Evidence confidence scoring", () => {
  it("computes confidence correctly", () => {
    const base = 0.9;
    const recency = 0.8;
    const meta = 0.9;

    const result = computeEvidenceConfidence(base, recency, meta);
    expect(result).toBeCloseTo(0.648, 3);
  });

  it("clamps confidence to [0,1]", () => {
    expect(computeEvidenceConfidence(2, 2, 2)).toBe(1);
    expect(computeEvidenceConfidence(-1, -1, -1)).toBe(0);
  });
});

describe("Criterion scoring", () => {
  it("scores 0 when no evidence exists", () => {
    const c = computeCriterionScore(
      {
        criterionId: "c1",
        cycleId: "cy1",
        targetLevel: 3,
        weight: 1,
        evidenceScores: [],
      },
      thresholds
    );

    expect(c.numericScore).toBe(0);
    expect(c.maturityLevel).toBe(1);
    expect(c.gap).toBe(2);
  });

  it("properly averages multiple evidence items", () => {
    const c = computeCriterionScore(
      {
        criterionId: "c1",
        cycleId: "cy1",
        targetLevel: 4,
        weight: 1,
        evidenceScores: [
          { confidence: 0.2 },
          { confidence: 0.8 },
        ] as any,
      },
      thresholds
    );

    expect(c.avgEvidenceConfidence).toBeCloseTo(0.5, 1);
    expect(c.maturityLevel).toBe(3);
  });

  it("clamps numeric score properly", () => {
    const c = computeCriterionScore(
      {
        criterionId: "c1",
        cycleId: "cy1",
        targetLevel: 2,
        weight: 1,
        evidenceScores: [{ confidence: 5 }] as any,
      },
      thresholds
    );

    expect(c.numericScore).toBe(1);
    expect(c.maturityLevel).toBe(5);
  });
});

describe("MPS scoring", () => {
  it("computes weighted average", () => {
    const m = computeMpsScore(
      "mps1",
      "cycle1",
      4,
      [
        { criterionId: "a", numericScore: 0.2 } as any,
        { criterionId: "b", numericScore: 0.8 } as any,
      ],
      { a: 1, b: 1 },
      thresholds
    );

    expect(m.numericScore).toBeCloseTo(0.5);
    expect(m.maturityLevel).toBe(3);
  });
});

describe("Domain scoring", () => {
  it("aggregates MPS scores with weights", () => {
    const d = computeDomainScore(
      "domain1",
      "cycle1",
      4,
      [
        { mpsId: "a", numericScore: 0.3 } as any,
        { mpsId: "b", numericScore: 0.7 } as any,
      ],
      { a: 1, b: 1 },
      thresholds
    );

    expect(d.numericScore).toBeCloseTo(0.5);
    expect(d.maturityLevel).toBe(3);
  });
});

describe("Organization maturity", () => {
  it("averages domain scores", () => {
    const out = computeOrganizationMaturity(
      [
        { domainId: "d1", numericScore: 0.4 } as any,
        { domainId: "d2", numericScore: 0.6 } as any,
      ],
      { d1: 1, d2: 1 },
      thresholds
    );

    expect(out.numericScore).toBeCloseTo(0.5);
    expect(out.maturityLevel).toBe(3);
  });
});
