import * as fs from "fs";
import * as path from "path";
import { describe, it, expect, vi } from "vitest";

interface AiCentreMigration {
  // A generic representation of a migration file's JSON structure.
  // Adjust fields as needed if a stricter type is available elsewhere.
  [key: string]: unknown;
}

const migrationsDirectory = path.join(__dirname, "fixtures", "ai-centre-migrations");

const readAllAiCentreMigrations = (): AiCentreMigration[] => {
  const dirExists = fs.existsSync(migrationsDirectory);
  if (!dirExists) {
    return [];
  }
  return fs.readdirSync(migrationsDirectory).map((file) => {
    const filePath = path.join(migrationsDirectory, file);
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  });
};

describe("readAllAiCentreMigrations", () => {
  it("returns an empty array when the migrations directory does not exist", () => {
    const existsSpy = vi.spyOn(fs, "existsSync").mockReturnValue(false);

    const result = readAllAiCentreMigrations();

    expect(result).toEqual([]);

    existsSpy.mockRestore();
  });
});